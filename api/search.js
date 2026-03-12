import Anthropic from "@anthropic-ai/sdk";

const CONVEX_URL = "https://pleasant-bobcat-119.convex.cloud";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "query required" });
  }

  try {
    // 1. Fetch links from Convex
    const convexResp = await fetch(`${CONVEX_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "links:list", args: {} }),
    });
    const convexData = await convexResp.json();

    if (convexData.status !== "success") {
      return res.status(500).json({ error: "Failed to fetch links from Convex" });
    }

    const links = convexData.value
      .filter((l) => l.link && l.link.startsWith("http"))
      .map((l, i) => ({
        id: i,
        title: l.title || l.link,
        date: l.ogdate || "",
        url: l.link,
        description: l.description || "",
      }));

    // 2. Build context — numbered IDs
    const context = links
      .map(
        (l) =>
          `[${l.id}] ${l.title}${l.description ? " — " + l.description : ""}`
      )
      .join("\n");

    // 3. Ask Claude — return only IDs + reasons
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:
        "You are a sarcastic but helpful links curator. You have numbered links below.\n\n" +
        "Return a JSON object: {\"message\": \"sarcastic 1-2 sentence intro\", \"picks\": [{\"id\": 42, \"reason\": \"one sentence why\"}]}\n\n" +
        "Pick 10-15 links. Strategy:\n" +
        "- 7-10 directly relevant (exploitation)\n" +
        "- 3-5 surprising/tangential — adjacent fields, contrarian takes, unexpected connections (exploration)\n\n" +
        "Return ONLY the JSON. No fences, no extra text.\n\n" +
        "LINKS:\n" +
        context,
      messages: [{ role: "user", content: query }],
    });

    let text = msg.content[0].text.trim();

    // Extract JSON
    const fenceMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)```/);
    const jsonText = fenceMatch ? fenceMatch[1].trim() : text;
    const objStart = jsonText.indexOf("{");
    const objEnd = jsonText.lastIndexOf("}");

    if (objStart === -1 || objEnd === -1) {
      return res.status(200).json({ query, message: "", results: [] });
    }

    const parsed = JSON.parse(jsonText.slice(objStart, objEnd + 1));
    const picks = parsed.picks || [];

    // 4. Resolve IDs back to full link objects
    const results = picks
      .map((p) => {
        const link = links[p.id];
        if (!link) return null;
        return {
          title: link.title,
          url: link.url,
          date: link.date,
          description: link.description,
          reason: p.reason || "",
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      query,
      message: parsed.message || "",
      results,
    });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

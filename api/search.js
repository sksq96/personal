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
      .map((l) => ({
        title: l.title || l.link,
        date: l.ogdate || "",
        url: l.link,
        description: l.description || "",
      }));

    // 2. Build context
    const context = links
      .map(
        (l, i) =>
          `${i + 1}. ${l.title}${l.description ? " — " + l.description : ""} | ${l.url}`
      )
      .join("\n");

    // 3. Ask Claude
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system:
        "You are a sarcastic but helpful links curator. You have a collection of saved links below.\n\n" +
        "When the user searches, pick 5-7 links and return a JSON object with this exact shape:\n" +
        '{"message": "a short sarcastic intro (1-2 sentences)", "results": [...]}\n\n' +
        "Each result should have: title, url, date, reason.\n" +
        '"reason" is ONE sentence explaining why you picked this link — be witty, specific, not generic.\n\n' +
        "SELECTION STRATEGY:\n" +
        "- 3-4 links should be directly relevant (exploitation)\n" +
        "- 2-3 links should be surprising or tangentially related — a hop or two away from the query (exploration)\n" +
        "  These could be from adjacent fields, contrarian takes, foundational ideas, or unexpected connections.\n" +
        "  Label these with a reason that explains the unexpected connection.\n\n" +
        "Return ONLY the JSON object. No markdown fences, no extra text.\n\n" +
        "LINKS:\n" +
        context,
      messages: [{ role: "user", content: query }],
    });

    let text = msg.content[0].text.trim();

    // Extract JSON object from response
    const fenceMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)```/);
    const jsonText = fenceMatch ? fenceMatch[1].trim() : text;

    const objStart = jsonText.indexOf("{");
    const objEnd = jsonText.lastIndexOf("}");
    if (objStart !== -1 && objEnd !== -1) {
      try {
        const parsed = JSON.parse(jsonText.slice(objStart, objEnd + 1));
        return res.status(200).json({
          query,
          message: parsed.message || "",
          results: parsed.results || [],
        });
      } catch {}
    }

    return res.status(200).json({ query, message: "", results: [] });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

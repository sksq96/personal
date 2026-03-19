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
    // Stage 1: Vector search — get top 30 candidates
    const resp = await fetch(`${CONVEX_URL}/api/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "links:search",
        args: { query, limit: 30 },
      }),
    });
    const data = await resp.json();

    if (data.status !== "success" || !data.value?.length) {
      return res.status(200).json({ query, message: "", results: [] });
    }

    const candidates = data.value;

    // Stage 2: Claude reranker — pick the best 10-15
    const context = candidates
      .map(
        (l, i) =>
          `[${i}] ${l.title}${l.description ? " — " + l.description : ""} | ${l.link}`
      )
      .join("\n");

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system:
        "You are a sarcastic but helpful links curator. You have 30 candidate links below, pre-filtered by semantic search.\n\n" +
        "Return a JSON object: {\"message\": \"sarcastic 1-2 sentence intro\", \"picks\": [0, 5, 12, ...]}\n\n" +
        "Pick 10-15 link indices. Strategy:\n" +
        "- Rerank by actual relevance to the query (the vector search order isn't perfect)\n" +
        "- Include some surprising/tangential picks — adjacent fields, unexpected connections\n" +
        "- Drop any that are clearly irrelevant noise from the vector search\n\n" +
        "Return ONLY the JSON. No fences, no extra text.\n\n" +
        "CANDIDATES:\n" +
        context,
      messages: [{ role: "user", content: query }],
    });

    let text = msg.content[0].text.trim();
    const fenceMatch = text.match(/```(?:json)?\s*\n([\s\S]*?)```/);
    const jsonText = fenceMatch ? fenceMatch[1].trim() : text;
    const objStart = jsonText.indexOf("{");
    const objEnd = jsonText.lastIndexOf("}");

    if (objStart === -1 || objEnd === -1) {
      // Fallback: return vector results as-is
      return res.status(200).json({
        query,
        message: "",
        results: candidates.slice(0, 15).map((l) => ({
          title: l.title || l.link,
          url: l.link,
          date: l.ogdate || "",
        })),
      });
    }

    const parsed = JSON.parse(jsonText.slice(objStart, objEnd + 1));
    const picks = parsed.picks || [];

    const results = picks
      .map((i) => candidates[i])
      .filter(Boolean)
      .map((l) => ({
        title: l.title || l.link,
        url: l.link,
        date: l.ogdate || "",
      }));

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

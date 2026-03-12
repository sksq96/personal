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

  // 1. Fetch links from Convex
  const convexResp = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: "links:list", args: {} }),
  });
  const convexData = await convexResp.json();

  if (convexData.status !== "success") {
    return res.status(500).json({ error: "Failed to fetch links" });
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
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    system:
      "You are a links search assistant. You have a collection of saved links below. " +
      "When the user asks a question, find the most relevant links and return ONLY a JSON array. " +
      "Each result should have: title, url, date, description. " +
      "Be smart — match semantically, not just keywords. " +
      "If the query mentions multiple concepts, find links relating to ALL of them. " +
      "Return at most 20 results, ranked by relevance. " +
      "Return ONLY the JSON array, no markdown fences, no explanation.\n\n" +
      "LINKS:\n" +
      context,
    messages: [{ role: "user", content: `Find links related to: ${query}` }],
  });

  let text = msg.content[0].text.trim();
  // Strip markdown fences if present
  if (text.startsWith("```")) {
    text = text.split("\n").slice(1).join("\n");
    if (text.endsWith("```")) text = text.slice(0, -3);
    text = text.trim();
  }

  try {
    const results = JSON.parse(text);
    return res.status(200).json({ query, results });
  } catch {
    return res.status(200).json({ query, results: [] });
  }
}

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
    // Call Convex vector search action
    const resp = await fetch(`${CONVEX_URL}/api/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "links:search",
        args: { query, limit: 15 },
      }),
    });
    const data = await resp.json();

    if (data.status !== "success") {
      return res.status(500).json({ error: data.errorMessage || "Search failed" });
    }

    const results = (data.value || []).map((l) => ({
      title: l.title || l.link,
      url: l.link,
      date: l.ogdate || "",
      score: l._score,
    }));

    return res.status(200).json({ query, message: "", results });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

const CONVEX_URL = "https://pleasant-bobcat-119.convex.cloud";

export default async function handler(req, res) {
  try {
    const allLinks = [];
    let cursor = null;

    // Paginate through all links
    while (true) {
      const resp = await fetch(`${CONVEX_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "links:list",
          args: cursor ? { cursor, limit: 200 } : { limit: 200 },
        }),
      });
      const data = await resp.json();

      if (data.status !== "success") {
        return res.status(500).json({ error: "Failed to fetch links" });
      }

      const page = data.value;
      for (const l of page.links) {
        if (l.link && l.link.startsWith("http")) {
          allLinks.push({
            title: l.title || l.link,
            date: l.ogdate || "",
            url: l.link,
            description: l.description || "",
          });
        }
      }

      if (page.done) break;
      cursor = page.cursor;
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(allLinks);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

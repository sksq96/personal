const CONVEX_URL = "https://pleasant-bobcat-119.convex.cloud";

export default async function handler(req, res) {
  try {
    const { cursor } = req.query;
    const args = { limit: 200 };
    if (cursor) args.cursor = cursor;

    const resp = await fetch(`${CONVEX_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "links:list", args }),
    });
    const data = await resp.json();

    if (data.status !== "success") {
      return res.status(500).json({ error: "Failed to fetch links" });
    }

    const page = data.value;
    const links = [];
    for (const l of page.links) {
      if (l.link && l.link.startsWith("http")) {
        links.push({
          title: l.title || l.link,
          date: l.ogdate || "",
          url: l.link,
          description: l.description || "",
        });
      }
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({
      links,
      cursor: page.done ? null : page.cursor,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

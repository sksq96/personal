const CONVEX_URL = "https://pleasant-bobcat-119.convex.cloud";

export default async function handler(req, res) {
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

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json(links);
}

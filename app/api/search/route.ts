const CONVEX_URL = 'https://pleasant-bobcat-119.convex.cloud'

export const maxDuration = 60

export async function POST(request: Request) {
  const { query } = await request.json().catch(() => ({ query: null }))
  if (!query) {
    return Response.json({ error: 'query required' }, { status: 400 })
  }

  try {
    const resp = await fetch(`${CONVEX_URL}/api/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'links:search',
        args: { query, limit: 15 },
      }),
    })
    const data = await resp.json()

    if (data.status !== 'success') {
      return Response.json({ error: data.errorMessage || 'Search failed' }, { status: 500 })
    }

    const results = (data.value || []).map((l: any) => ({
      title: l.title || l.link,
      url: l.link,
      date: l.ogdate || '',
      score: l._score,
    }))

    return Response.json({ query, message: '', results })
  } catch (err: any) {
    return Response.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}

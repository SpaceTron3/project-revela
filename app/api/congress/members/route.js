export const dynamic = 'force-dynamic'

export async function GET(request) {
  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    // Fetch a large batch of current members
    const [page1, page2] = await Promise.all([
      fetch(`https://api.congress.gov/v3/member?limit=250&offset=0&api_key=${API_KEY}&currentMember=true`, { next: { revalidate: 86400 } }),
      fetch(`https://api.congress.gov/v3/member?limit=250&offset=250&api_key=${API_KEY}&currentMember=true`, { next: { revalidate: 86400 } }),
    ])

    const [data1, data2] = await Promise.all([
      page1.json(),
      page2.json(),
    ])

    const all = [...(data1.members || []), ...(data2.members || [])]

    // Deduplicate by bioguideId
    const seen = new Set()
    const members = all.filter(m => {
      if (seen.has(m.bioguideId)) return false
      seen.add(m.bioguideId)
      return true
    })

    // Sort alphabetically
    members.sort((a, b) => a.name?.localeCompare(b.name))

    return Response.json(
      { members, total: members.length },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } }
    )
  } catch (error) {
    console.error('Congress members API error:', error)
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

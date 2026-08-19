export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    // Fetch both chambers in parallel
    const [houseRes, senateRes] = await Promise.all([
      fetch(`https://api.congress.gov/v3/member?limit=250&offset=0&api_key=${API_KEY}&currentMember=true&chamber=house`, { next: { revalidate: 86400 } }),
      fetch(`https://api.congress.gov/v3/member?limit=150&offset=0&api_key=${API_KEY}&currentMember=true&chamber=senate`, { next: { revalidate: 86400 } }),
    ])

    const [houseData, senateData] = await Promise.all([
      houseRes.json(),
      senateRes.json(),
    ])

    const houseMembers = houseData.members || []
    const senateMembers = senateData.members || []

    // Combine and sort alphabetically
    const allMembers = [...houseMembers, ...senateMembers]
    allMembers.sort((a, b) => a.name?.localeCompare(b.name))

    return Response.json(
      { members: allMembers, total: allMembers.length },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } }
    )
  } catch (error) {
    console.error('Congress members API error:', error)
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

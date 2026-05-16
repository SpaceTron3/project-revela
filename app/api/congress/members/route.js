export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const offset = searchParams.get('offset') || 0
  const limit = searchParams.get('limit') || 60
  const party = searchParams.get('party') || 'ALL'
  const chamber = searchParams.get('chamber') || 'ALL'

  const API_KEY = process.env.CONGRESS_API_KEY

  let url = `https://api.congress.gov/v3/member?limit=${limit}&offset=${offset}&api_key=${API_KEY}&currentMember=true`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()

    let members = data.members || []

    // Filter by party
    if (party !== 'ALL') {
      members = members.filter(m => m.partyName?.startsWith(party))
    }

    // Filter by chamber
    if (chamber !== 'ALL') {
      members = members.filter(m => {
        const latestTerm = m.terms?.item?.[m.terms.item.length - 1]
        return latestTerm?.chamber === chamber
      })
    }

    // Sort alphabetically by last name
    members.sort((a, b) => a.name?.localeCompare(b.name))

    return Response.json({ members, total: data.pagination?.count })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state')

  if (!state) {
    return Response.json({ error: 'State is required' }, { status: 400 })
  }

  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    // Fetch multiple pages to get all members
    const allMembers = []
    let offset = 0
    const limit = 250

    const res = await fetch(
      `https://api.congress.gov/v3/member?limit=${limit}&offset=${offset}&api_key=${API_KEY}&format=json`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    allMembers.push(...(data.members || []))

    // Filter by state name
    const stateMembers = allMembers.filter(m => m.state === state)

    return Response.json({ members: stateMembers, total: stateMembers.length })
  } catch (error) {
    console.error('Congress state API error:', error)
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

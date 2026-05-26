export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const offset = searchParams.get('offset') || 0
  const limit = 250 // fetch more to ensure good coverage
  const API_KEY = process.env.CONGRESS_API_KEY

  const url = `https://api.congress.gov/v3/member?limit=${limit}&offset=${offset}&api_key=${API_KEY}&currentMember=true`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const data = await res.json()
    let members = data.members || []

    // Sort alphabetically by name
    members.sort((a, b) => a.name?.localeCompare(b.name))

    return Response.json({ members, total: data.pagination?.count })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

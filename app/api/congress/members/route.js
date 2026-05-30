export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const offset = parseInt(searchParams.get('offset') || '0')
  const limit = Math.min(parseInt(searchParams.get('limit') || '60'), 250)
  const API_KEY = process.env.CONGRESS_API_KEY

  const url = `https://api.congress.gov/v3/member?limit=${limit}&offset=${offset}&api_key=${API_KEY}&currentMember=true`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } }) // Cache for 24 hours
    const data = await res.json()
    let members = data.members || []

    members.sort((a, b) => a.name?.localeCompare(b.name))

    return Response.json(
      { members, total: data.pagination?.count },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

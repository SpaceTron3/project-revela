export async function GET(request, { params }) {
  const { bioguideId } = params
  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    const res = await fetch(
      `https://api.congress.gov/v3/member/${bioguideId}?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    return Response.json({ member: data.member })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch member' }, { status: 500 })
  }
}

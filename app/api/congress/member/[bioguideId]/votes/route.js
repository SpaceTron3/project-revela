export async function GET(request, { params }) {
  const { bioguideId } = params
  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    const res = await fetch(
      `https://api.congress.gov/v3/member/${bioguideId}/votes?limit=20&api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    return Response.json({ votes: data.votes || [] })
  } catch (error) {
    return Response.json({ votes: [] })
  }
}

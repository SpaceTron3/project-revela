export async function GET(request, { params }) {
  const { bioguideId } = params
  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    const res = await fetch(
      `https://api.congress.gov/v3/member/${bioguideId}/sponsored-legislation?limit=10&api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    return Response.json({ bills: data.sponsoredLegislation || [] })
  } catch (error) {
    return Response.json({ bills: [] })
  }
}

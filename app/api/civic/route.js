export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return Response.json({ error: 'Address is required' }, { status: 400 })
  }

  const API_KEY = process.env.GOOGLE_CIVIC_API_KEY

  try {
    const res = await fetch(
      `https://www.googleapis.com/civicinfo/v2/voterinfo?address=${encodeURIComponent(address)}&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()

    if (!res.ok) {
      return Response.json({ elections: [], message: data.error?.message || 'No election data found' })
    }

    return Response.json({
      election: data.election || null,
      contests: data.contests || [],
      pollingLocations: data.pollingLocations || [],
    })
  } catch (error) {
    console.error('Civic API error:', error)
    return Response.json({ error: 'Failed to fetch civic data' }, { status: 500 })
  }
}

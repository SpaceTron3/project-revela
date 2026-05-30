export const dynamic = 'force-dynamic'

const STATE_CODES = {
  'Alabama': 'al', 'Alaska': 'ak', 'Arizona': 'az', 'Arkansas': 'ar', 'California': 'ca',
  'Colorado': 'co', 'Connecticut': 'ct', 'Delaware': 'de', 'Florida': 'fl', 'Georgia': 'ga',
  'Hawaii': 'hi', 'Idaho': 'id', 'Illinois': 'il', 'Indiana': 'in', 'Iowa': 'ia',
  'Kansas': 'ks', 'Kentucky': 'ky', 'Louisiana': 'la', 'Maine': 'me', 'Maryland': 'md',
  'Massachusetts': 'ma', 'Michigan': 'mi', 'Minnesota': 'mn', 'Mississippi': 'ms', 'Missouri': 'mo',
  'Montana': 'mt', 'Nebraska': 'ne', 'Nevada': 'nv', 'New Hampshire': 'nh', 'New Jersey': 'nj',
  'New Mexico': 'nm', 'New York': 'ny', 'North Carolina': 'nc', 'North Dakota': 'nd', 'Ohio': 'oh',
  'Oklahoma': 'ok', 'Oregon': 'or', 'Pennsylvania': 'pa', 'Rhode Island': 'ri', 'South Carolina': 'sc',
  'South Dakota': 'sd', 'Tennessee': 'tn', 'Texas': 'tx', 'Utah': 'ut', 'Vermont': 'vt',
  'Virginia': 'va', 'Washington': 'wa', 'West Virginia': 'wv', 'Wisconsin': 'wi', 'Wyoming': 'wy',
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state')

  if (!state) {
    return Response.json({ error: 'State is required' }, { status: 400 })
  }

  const stateCode = STATE_CODES[state]
  if (!stateCode) {
    return Response.json({ error: 'Invalid state' }, { status: 400 })
  }

  const API_KEY = process.env.OPENSTATES_API_KEY

  try {
    const res = await fetch(
      `https://v3.openstates.org/people?jurisdiction=${stateCode}&org_classification=executive&per_page=10&apikey=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )

    if (!res.ok) {
      return Response.json({ executives: [] })
    }

    const data = await res.json()
    const executives = (data.results || []).map(p => ({
      name: p.name,
      title: p.current_role?.title?.replace(/_/g, ' ') || 'Official',
      party: p.party,
      image: p.image || null,
      email: p.email || null,
      url: p.openstates_url || null,
    }))

    // Sort: Governor first, then Lt Governor, then others
    const order = ['Governor', 'Lt Governor', 'Attorney General', 'Secretary Of State']
    executives.sort((a, b) => {
      const ai = order.findIndex(o => a.title.toLowerCase().includes(o.toLowerCase()))
      const bi = order.findIndex(o => b.title.toLowerCase().includes(o.toLowerCase()))
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

    return Response.json({ executives })
  } catch (error) {
    console.error('Open States API error:', error)
    return Response.json({ executives: [] })
  }
}

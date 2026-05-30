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

// Fallback governor data for states missing from Open States
const GOVERNOR_FALLBACK = {
  'California': { name: 'Gavin Newsom', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Gavin_Newsom_2019.jpg/440px-Gavin_Newsom_2019.jpg' },
  'New York': { name: 'Kathy Hochul', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kathy_Hochul_official_photo_%28cropped%29.jpg/440px-Kathy_Hochul_official_photo_%28cropped%29.jpg' },
  'Texas': { name: 'Greg Abbott', party: 'Republican', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Greg_Abbott.jpg/440px-Greg_Abbott.jpg' },
  'Illinois': { name: 'JB Pritzker', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/JB_Pritzker_official_portrait_%28cropped%29.jpg/440px-JB_Pritzker_official_portrait_%28cropped%29.jpg' },
  'Pennsylvania': { name: 'Josh Shapiro', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Josh_Shapiro_official_portrait%2C_2023_%28cropped%29.jpg/440px-Josh_Shapiro_official_portrait%2C_2023_%28cropped%29.jpg' },
  'Michigan': { name: 'Gretchen Whitmer', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gretchen_Whitmer_official_portrait_%28cropped%29.jpg/440px-Gretchen_Whitmer_official_portrait_%28cropped%29.jpg' },
  'Georgia': { name: 'Brian Kemp', party: 'Republican', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Brian_Kemp_official_portrait_%28cropped%29.jpg/440px-Brian_Kemp_official_portrait_%28cropped%29.jpg' },
  'North Carolina': { name: 'Josh Stein', party: 'Democratic', image: null },
  'Virginia': { name: 'Glenn Youngkin', party: 'Republican', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Glenn_Youngkin_official_portrait_%28cropped%29.jpg/440px-Glenn_Youngkin_official_portrait_%28cropped%29.jpg' },
  'Washington': { name: 'Bob Ferguson', party: 'Democratic', image: null },
  'Arizona': { name: 'Katie Hobbs', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Katie_Hobbs_official_portrait_%28cropped%29.jpg/440px-Katie_Hobbs_official_portrait_%28cropped%29.jpg' },
  'Massachusetts': { name: 'Maura Healey', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Maura_Healey_official_portrait_%28cropped%29.jpg/440px-Maura_Healey_official_portrait_%28cropped%29.jpg' },
  'Colorado': { name: 'Jared Polis', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Jared_Polis_official_portrait_%28cropped%29.jpg/440px-Jared_Polis_official_portrait_%28cropped%29.jpg' },
  'Minnesota': { name: 'Tim Walz', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Tim_Walz_official_photo_%28cropped%29.jpg/440px-Tim_Walz_official_photo_%28cropped%29.jpg' },
  'Wisconsin': { name: 'Tony Evers', party: 'Democratic', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Tony_Evers_official_portrait_%28cropped%29.jpg/440px-Tony_Evers_official_portrait_%28cropped%29.jpg' },
  'Oregon': { name: 'Tina Kotek', party: 'Democratic', image: null },
  'Nevada': { name: 'Joe Lombardo', party: 'Republican', image: null },
  'New Mexico': { name: 'Michelle Lujan Grisham', party: 'Democratic', image: null },
  'Connecticut': { name: 'Ned Lamont', party: 'Democratic', image: null },
  'Hawaii': { name: 'Josh Green', party: 'Democratic', image: null },
  'Maine': { name: 'Janet Mills', party: 'Democratic', image: null },
  'Rhode Island': { name: 'Dan McKee', party: 'Democratic', image: null },
  'New Hampshire': { name: 'Kelly Ayotte', party: 'Republican', image: null },
  'Vermont': { name: 'Phil Scott', party: 'Republican', image: null },
  'Delaware': { name: 'Matt Meyer', party: 'Democratic', image: null },
  'Maryland': { name: 'Wes Moore', party: 'Democratic', image: null },
  'New Jersey': { name: 'Phil Murphy', party: 'Democratic', image: null },
  'Ohio': { name: 'Mike DeWine', party: 'Republican', image: null },
  'Indiana': { name: 'Mike Braun', party: 'Republican', image: null },
  'Missouri': { name: 'Mike Kehoe', party: 'Republican', image: null },
  'Tennessee': { name: 'Bill Lee', party: 'Republican', image: null },
  'Kentucky': { name: 'Andy Beshear', party: 'Democratic', image: null },
  'Alabama': { name: 'Kay Ivey', party: 'Republican', image: null },
  'South Carolina': { name: 'Henry McMaster', party: 'Republican', image: null },
  'Iowa': { name: 'Kim Reynolds', party: 'Republican', image: null },
  'Kansas': { name: 'Laura Kelly', party: 'Democratic', image: null },
  'Arkansas': { name: 'Sarah Huckabee Sanders', party: 'Republican', image: null },
  'Mississippi': { name: 'Tate Reeves', party: 'Republican', image: null },
  'Louisiana': { name: 'Jeff Landry', party: 'Republican', image: null },
  'Oklahoma': { name: 'Kevin Stitt', party: 'Republican', image: null },
  'Utah': { name: 'Spencer Cox', party: 'Republican', image: null },
  'Idaho': { name: 'Brad Little', party: 'Republican', image: null },
  'Montana': { name: 'Greg Gianforte', party: 'Republican', image: null },
  'Wyoming': { name: 'Mark Gordon', party: 'Republican', image: null },
  'North Dakota': { name: 'Kelly Armstrong', party: 'Republican', image: null },
  'South Dakota': { name: 'Kristi Noem', party: 'Republican', image: null },
  'Nebraska': { name: 'Jim Pillen', party: 'Republican', image: null },
  'West Virginia': { name: 'Patrick Morrisey', party: 'Republican', image: null },
  'Alaska': { name: 'Mike Dunleavy', party: 'Republican', image: null },
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
    let executives = (data.results || []).map(p => ({
      name: p.name,
      title: p.current_role?.title?.replace(/_/g, ' ') || 'Official',
      party: p.party,
      image: p.image || null,
      email: p.email || null,
      url: p.openstates_url || null,
    }))

    // Check if governor is missing and inject from fallback
    const hasGovernor = executives.some(e => e.title.toLowerCase().includes('governor') && !e.title.toLowerCase().includes('lt'))
    if (!hasGovernor && GOVERNOR_FALLBACK[state]) {
      const fallback = GOVERNOR_FALLBACK[state]
      executives.unshift({
        name: fallback.name,
        title: 'Governor',
        party: fallback.party,
        image: fallback.image,
        email: null,
        url: null,
      })
    }

    // Sort: Governor first, then Lt Governor, then others
    const order = ['Governor', 'Lt Governor', 'Attorney General', 'Secretary Of State']
    executives.sort((a, b) => {
      const ai = order.findIndex(o => a.title.toLowerCase() === o.toLowerCase() || (o === 'Lt Governor' && a.title.toLowerCase().includes('lt')))
      const bi = order.findIndex(o => b.title.toLowerCase() === o.toLowerCase() || (o === 'Lt Governor' && b.title.toLowerCase().includes('lt')))
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

    return Response.json({ executives })
  } catch (error) {
    console.error('Open States API error:', error)
    return Response.json({ executives: [] })
  }
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

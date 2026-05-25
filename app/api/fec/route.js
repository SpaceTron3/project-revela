export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const state = searchParams.get('state')

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const API_KEY = process.env.FEC_API_KEY

  try {
    // Extract last name only for best FEC matching
    const lastName = name.includes(',')
      ? name.split(',')[0].trim()
      : name.split(' ').pop().trim()

    const url = `https://api.open.fec.gov/v1/candidates/?name=${encodeURIComponent(lastName)}&per_page=50&api_key=${API_KEY}${state ? `&state=${state}` : ''}`

    const candidateRes = await fetch(url, { next: { revalidate: 86400 } })

    if (!candidateRes.ok) {
      return Response.json({ finance: null, message: 'FEC API error' })
    }

    const candidateData = await candidateRes.json()
    const candidates = candidateData.results || []

    if (candidates.length === 0) {
      return Response.json({ finance: null, message: 'No FEC data found' })
    }

    // Filter by state if provided, then pick most recent active candidate
    const stateFiltered = state
      ? candidates.filter(c => c.state === state || c.state === 'US')
      : candidates

    // Sort: prefer candidates with raised funds, most recent active_through
    const sorted = stateFiltered.sort((a, b) => {
      if (a.has_raised_funds && !b.has_raised_funds) return -1
      if (!a.has_raised_funds && b.has_raised_funds) return 1
      return (b.active_through || 0) - (a.active_through || 0)
    })

    const candidate = sorted[0]
    if (!candidate) {
      return Response.json({ finance: null, message: 'No matching candidate found' })
    }

    const candidateId = candidate.candidate_id

    // Get financial totals
    const totalsRes = await fetch(
      `https://api.open.fec.gov/v1/candidate/${candidateId}/totals/?per_page=1&sort=-cycle&api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )
    const totalsData = await totalsRes.json()
    const totals = totalsData.results?.[0] || null

    // Get top contributors
    const contributorsRes = await fetch(
      `https://api.open.fec.gov/v1/schedules/schedule_a/by_contributor/?candidate_id=${candidateId}&per_page=10&sort=-total&api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )
    const contributorsData = await contributorsRes.json()
    const contributors = contributorsData.results || []

    // Get industry breakdown
    const industriesRes = await fetch(
      `https://api.open.fec.gov/v1/schedules/schedule_a/by_industry/?candidate_id=${candidateId}&per_page=10&sort=-total&api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )
    const industriesData = await industriesRes.json()
    const industries = industriesData.results || []

    return Response.json({
      finance: {
        candidateId,
        name: candidate.name,
        party: candidate.party,
        state: candidate.state,
        office: candidate.office_full,
        totalRaised: totals?.receipts || 0,
        totalSpent: totals?.disbursements || 0,
        cashOnHand: totals?.last_cash_on_hand_end_period || 0,
        cycle: totals?.cycle || null,
        contributors: contributors.map(c => ({
          name: c.contributor_name,
          total: c.total,
          count: c.count,
        })),
        industries: industries.map(i => ({
          name: i.industry,
          total: i.total,
          count: i.count,
        })),
      }
    })
  } catch (error) {
    console.error('FEC API error:', error)
    return Response.json({ finance: null, error: 'Failed to fetch FEC data' })
  }
}
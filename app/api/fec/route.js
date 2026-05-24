export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const state = searchParams.get('state')

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const API_KEY = process.env.FEC_API_KEY

  try {
    // Step 1: Find the candidate by name
    const searchName = name.split(',').reverse().join(' ').trim()
    const candidateRes = await fetch(
      `https://api.open.fec.gov/v1/candidates/search/?q=${encodeURIComponent(searchName)}&office=H,S&is_active_candidate=true&per_page=5&api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )
    const candidateData = await candidateRes.json()
    const candidates = candidateData.results || []

    // Try to match by state if provided
    let candidate = candidates.find(c => c.state === state) || candidates[0]

    if (!candidate) {
      return Response.json({ finance: null, message: 'No FEC data found' })
    }

    const candidateId = candidate.candidate_id

    // Step 2: Get totals for most recent cycle
    const totalsRes = await fetch(
      `https://api.open.fec.gov/v1/candidate/${candidateId}/totals/?per_page=1&api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )
    const totalsData = await totalsRes.json()
    const totals = totalsData.results?.[0] || null

    // Step 3: Get top contributors
    const contributorsRes = await fetch(
      `https://api.open.fec.gov/v1/schedules/schedule_a/by_contributor/?candidate_id=${candidateId}&per_page=10&sort=-total&api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )
    const contributorsData = await contributorsRes.json()
    const contributors = contributorsData.results || []

    // Step 4: Get industry breakdown
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
        office: candidate.office,
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

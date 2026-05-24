export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const state = searchParams.get('state')

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const API_KEY = process.env.FEC_API_KEY

  try {
    // Clean up name - convert "Last, First" to "First Last"
    const cleanName = name.includes(',')
      ? name.split(',').reverse().join(' ').trim()
      : name.trim()

    // Use the /candidates/ endpoint with name search
    const params = new URLSearchParams({
      q: cleanName,
      per_page: '10',
      sort: '-receipts',
      api_key: API_KEY,
    })

    if (state) params.append('state', state)

    const candidateRes = await fetch(
      `https://api.open.fec.gov/v1/candidates/?${params}`,
      { next: { revalidate: 86400 } }
    )

    if (!candidateRes.ok) {
      const err = await candidateRes.text()
      console.error('FEC candidates error:', err)
      return Response.json({ finance: null, message: 'FEC API error' })
    }

    const candidateData = await candidateRes.json()
    const candidates = candidateData.results || []

    if (candidates.length === 0) {
      // Try with just last name
      const lastName = cleanName.split(' ').pop()
      const retryParams = new URLSearchParams({
        q: lastName,
        per_page: '5',
        sort: '-receipts',
        api_key: API_KEY,
      })
      if (state) retryParams.append('state', state)

      const retryRes = await fetch(
        `https://api.open.fec.gov/v1/candidates/?${retryParams}`,
        { next: { revalidate: 86400 } }
      )
      const retryData = await retryRes.json()
      if (!retryData.results?.length) {
        return Response.json({ finance: null, message: 'No FEC data found' })
      }
      candidates.push(...retryData.results)
    }

    const candidate = candidates[0]
    const candidateId = candidate.candidate_id

    // Get financial totals
    const totalsRes = await fetch(
      `https://api.open.fec.gov/v1/candidate/${candidateId}/totals/?per_page=1&api_key=${API_KEY}`,
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
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const candidateId = searchParams.get('candidateId')
  const API_KEY = process.env.FEC_API_KEY

  if (!candidateId) {
    return Response.json({ error: 'candidateId is required' }, { status: 400 })
  }

  try {
    // Get independent expenditures (Super PAC spending) for this candidate
    const ieRes = await fetch(
      `https://api.open.fec.gov/v1/schedules/schedule_e/?candidate_id=${candidateId}&per_page=20&sort=-expenditure_amount&api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    )
    const ieData = await ieRes.json()
    const expenditures = ieData.results || []

    // Aggregate by committee (Super PAC)
    const pacMap = {}
    expenditures.forEach(e => {
      const name = e.committee?.name || e.payee_name || 'Unknown PAC'
      const amount = e.expenditure_amount || 0
      const support = e.support_oppose_indicator === 'S' ? 'support' : 'oppose'
      if (!pacMap[name]) {
        pacMap[name] = { name, total: 0, support: 0, oppose: 0, committeeId: e.committee_id }
      }
      pacMap[name].total += amount
      pacMap[name][support] += amount
    })

    const pacs = Object.values(pacMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    // Get total outside spending
    const totalOutside = pacs.reduce((sum, p) => sum + p.total, 0)
    const totalSupport = pacs.reduce((sum, p) => sum + p.support, 0)
    const totalOppose = pacs.reduce((sum, p) => sum + p.oppose, 0)

    return Response.json({
      pacs,
      totalOutside,
      totalSupport,
      totalOppose,
    })
  } catch (error) {
    console.error('Outside spending API error:', error)
    return Response.json({ error: 'Failed to fetch outside spending data' }, { status: 500 })
  }
}

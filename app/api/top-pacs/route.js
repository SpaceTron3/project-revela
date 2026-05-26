export async function GET(request) {
  const API_KEY = process.env.FEC_API_KEY

  // Well-known Super PACs with their FEC committee IDs
  const KNOWN_PACS = [
    { name: 'AIPAC (United Democracy Project)', id: 'C00793190', party: 'Bipartisan' },
    { name: 'Senate Leadership Fund', id: 'C00571703', party: 'Republican' },
    { name: 'Senate Majority PAC', id: 'C00484642', party: 'Democrat' },
    { name: 'Congressional Leadership Fund', id: 'C00504530', party: 'Republican' },
    { name: 'House Majority PAC', id: 'C00484618', party: 'Democrat' },
    { name: 'Club for Growth Action', id: 'C00487470', party: 'Republican' },
    { name: 'Emily\'s List', id: 'C00193433', party: 'Democrat' },
    { name: 'American Crossroads', id: 'C00504530', party: 'Republican' },
  ]

  try {
    const results = await Promise.allSettled(
      KNOWN_PACS.map(async pac => {
        const res = await fetch(
          `https://api.open.fec.gov/v1/committee/${pac.id}/totals/?per_page=1&sort=-cycle&api_key=${API_KEY}`,
          { next: { revalidate: 86400 } }
        )
        const data = await res.json()
        const totals = data.results?.[0] || {}
        return {
          ...pac,
          raised: totals.receipts || 0,
          spent: totals.disbursements || 0,
          cycle: totals.cycle || 2024,
        }
      })
    )

    const pacs = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .sort((a, b) => b.spent - a.spent)

    return Response.json({ pacs })
  } catch (error) {
    console.error('PAC tracker error:', error)
    return Response.json({ error: 'Failed to fetch PAC data' }, { status: 500 })
  }
}

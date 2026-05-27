// Industry to bill keyword mapping
const INDUSTRY_KEYWORDS = {
  'Finance': ['bank', 'financial', 'credit', 'lending', 'securities', 'investment', 'wall street', 'capital markets', 'mortgage'],
  'Insurance': ['insurance', 'health coverage', 'affordable care', 'medicaid', 'premium'],
  'Pharmaceuticals': ['drug', 'pharmaceutical', 'prescription', 'medicare', 'opioid', 'fda', 'biologic', 'generic'],
  'Oil & Gas': ['energy', 'petroleum', 'pipeline', 'emissions', 'fossil fuel', 'drilling', 'natural gas', 'coal', 'offshore'],
  'Defense': ['defense', 'military', 'weapon', 'armed forces', 'pentagon', 'national security', 'veteran', 'army', 'navy'],
  'Real Estate': ['housing', 'mortgage', 'rent', 'property', 'zoning', 'affordable housing', 'homeowner'],
  'Technology': ['data', 'privacy', 'antitrust', 'tech', 'artificial intelligence', 'cybersecurity', 'broadband', 'internet'],
  'Agriculture': ['farm', 'agriculture', 'crop', 'food safety', 'rural', 'livestock', 'dairy'],
  'Healthcare': ['health', 'hospital', 'medicare', 'medicaid', 'affordable care', 'aca', 'mental health'],
  'Education': ['education', 'student loan', 'school', 'college', 'university', 'pell grant'],
  'Lawyers': ['legal', 'tort', 'liability', 'lawsuit', 'judicial', 'court'],
  'Labor': ['union', 'wage', 'worker', 'employment', 'minimum wage', 'labor', 'workplace'],
  'Telecom': ['telecommunications', 'broadband', 'internet', 'net neutrality', 'fcc', 'wireless'],
  'Mining': ['mining', 'coal', 'mineral', 'natural resource', 'extraction'],
  'Transportation': ['transportation', 'highway', 'infrastructure', 'rail', 'aviation', 'transit'],
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const bioguideId = searchParams.get('bioguideId')
  const industries = searchParams.get('industries')?.split(',').map(i => i.trim()).filter(Boolean) || []

  if (!bioguideId) {
    return Response.json({ error: 'bioguideId is required' }, { status: 400 })
  }

  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    // Fetch member's sponsored bills
    const billsRes = await fetch(
      `https://api.congress.gov/v3/member/${bioguideId}/sponsored-legislation?limit=250&api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    const billsData = await billsRes.json()
    const bills = billsData.sponsoredLegislation || []

    if (bills.length === 0) {
      return Response.json({ correlations: [], overallScore: null, totalBills: 0 })
    }

    // For each industry, find relevant bills
    const industriesToCheck = industries.length > 0 ? industries.slice(0, 6) : Object.keys(INDUSTRY_KEYWORDS).slice(0, 6)

    const correlations = industriesToCheck.map(industry => {
      const keywords = INDUSTRY_KEYWORDS[industry] || []
      const relevantBills = bills.filter(bill => {
        const title = (bill.title || '').toLowerCase()
        return keywords.some(kw => title.includes(kw))
      })

      if (relevantBills.length === 0) return null

      // Count enacted/passed bills (shows effectiveness/priority)
      const enacted = relevantBills.filter(b =>
        b.latestAction?.text?.toLowerCase().includes('became') ||
        b.latestAction?.text?.toLowerCase().includes('signed into law')
      ).length

      const passed = relevantBills.filter(b =>
        b.latestAction?.text?.toLowerCase().includes('passed')
      ).length

      // Alignment score: what % of their bills favor this industry
      const alignmentScore = Math.round((relevantBills.length / bills.length) * 100 * 10)
      const cappedScore = Math.min(alignmentScore, 100)

      return {
        industry,
        totalBills: relevantBills.length,
        enacted,
        passed,
        alignmentScore: cappedScore,
        exampleBills: relevantBills.slice(0, 4).map(b => ({
          number: b.number,
          title: b.title,
          latestAction: b.latestAction?.text || '',
          date: b.latestAction?.actionDate || '',
          url: b.url,
        })),
      }
    }).filter(Boolean)

    // Sort by alignment score
    correlations.sort((a, b) => b.alignmentScore - a.alignmentScore)

    const overallScore = correlations.length > 0
      ? Math.round(correlations.reduce((sum, c) => sum + c.alignmentScore, 0) / correlations.length)
      : null

    return Response.json({
      correlations,
      overallScore,
      totalBills: bills.length,
    })
  } catch (error) {
    console.error('Correlation API error:', error)
    return Response.json({ error: 'Failed to calculate correlations' }, { status: 500 })
  }
}

// Industry to bill keyword mapping
const INDUSTRY_KEYWORDS = {
  'Finance': ['bank', 'financial', 'credit', 'lending', 'wall street', 'securities', 'investment'],
  'Insurance': ['insurance', 'health coverage', 'medicaid', 'affordable care'],
  'Pharmaceuticals': ['drug', 'pharmaceutical', 'prescription', 'medicare', 'opioid', 'fda'],
  'Oil & Gas': ['energy', 'petroleum', 'pipeline', 'emissions', 'climate', 'fossil fuel', 'drilling'],
  'Defense': ['defense', 'military', 'weapon', 'armed forces', 'pentagon', 'national security'],
  'Real Estate': ['housing', 'mortgage', 'rent', 'property', 'zoning', 'affordable housing'],
  'Technology': ['data', 'privacy', 'antitrust', 'tech', 'artificial intelligence', 'cybersecurity'],
  'Agriculture': ['farm', 'agriculture', 'crop', 'food safety', 'rural'],
  'Healthcare': ['health', 'hospital', 'medicare', 'medicaid', 'aca', 'affordable care'],
  'Education': ['education', 'student loan', 'school', 'college', 'university'],
  'Lawyers': ['legal', 'tort', 'liability', 'lawsuit', 'judicial'],
  'Labor': ['union', 'wage', 'worker', 'employment', 'minimum wage'],
  'Telecom': ['telecommunications', 'broadband', 'internet', 'net neutrality', 'fcc'],
  'Mining': ['mining', 'coal', 'mineral', 'natural resource'],
  'Transportation': ['transportation', 'highway', 'infrastructure', 'rail', 'aviation'],
}

// Determine if a vote aligns with donor interests
// Returns 'aligned', 'opposed', or 'neutral'
function getAlignment(billTitle, votePosition, industry) {
  const keywords = INDUSTRY_KEYWORDS[industry] || []
  const titleLower = (billTitle || '').toLowerCase()
  
  const isRelevant = keywords.some(kw => titleLower.includes(kw))
  if (!isRelevant) return 'neutral'

  // Industries that generally prefer deregulation/less oversight
  const deregulationIndustries = ['Finance', 'Oil & Gas', 'Defense', 'Real Estate', 'Technology', 'Mining', 'Telecom', 'Agriculture']
  // Industries that benefit from government spending/regulation
  const regulationIndustries = ['Healthcare', 'Pharmaceuticals', 'Education', 'Labor', 'Lawyers', 'Insurance', 'Transportation']

  const isYes = votePosition === 'Yes' || votePosition === 'Yea'

  if (deregulationIndustries.includes(industry)) {
    // These industries typically favor less regulation, more spending on defense/energy
    return isYes ? 'aligned' : 'opposed'
  } else {
    return isYes ? 'aligned' : 'opposed'
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const bioguideId = searchParams.get('bioguideId')
  const industries = searchParams.get('industries')?.split(',') || []

  if (!bioguideId || !industries.length) {
    return Response.json({ error: 'bioguideId and industries are required' }, { status: 400 })
  }

  const API_KEY = process.env.CONGRESS_API_KEY

  try {
    // Fetch member's voting record
    const votesRes = await fetch(
      `https://api.congress.gov/v3/member/${bioguideId}/votes?limit=100&api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    )
    const votesData = await votesRes.json()
    const votes = votesData.votes || []

    // For each industry, find relevant votes and calculate alignment
    const correlations = industries.slice(0, 5).map(industry => {
      const relevantVotes = votes.filter(vote => {
        const title = vote.description || ''
        const keywords = INDUSTRY_KEYWORDS[industry] || []
        return keywords.some(kw => title.toLowerCase().includes(kw))
      })

      if (relevantVotes.length === 0) {
        return { industry, alignmentScore: null, relevantVotes: [], totalVotes: 0 }
      }

      const aligned = relevantVotes.filter(v => {
        const alignment = getAlignment(v.description, v.votePosition, industry)
        return alignment === 'aligned'
      })

      const alignmentScore = Math.round((aligned.length / relevantVotes.length) * 100)

      return {
        industry,
        alignmentScore,
        totalVotes: relevantVotes.length,
        alignedVotes: aligned.length,
        relevantVotes: relevantVotes.slice(0, 3).map(v => ({
          description: v.description,
          date: v.date,
          position: v.votePosition,
          aligned: getAlignment(v.description, v.votePosition, industry) === 'aligned',
        })),
      }
    }).filter(c => c.totalVotes > 0)

    const overallScore = correlations.length > 0
      ? Math.round(correlations.reduce((sum, c) => sum + (c.alignmentScore || 0), 0) / correlations.length)
      : null

    return Response.json({ correlations, overallScore })
  } catch (error) {
    console.error('Correlation API error:', error)
    return Response.json({ error: 'Failed to calculate correlations' }, { status: 500 })
  }
}

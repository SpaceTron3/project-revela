import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  try {
    const { promiseId, bioguideId, promiseText, bills, votes } = await request.json()

    if (!promiseText || !bioguideId) {
      return Response.json({ error: 'promiseText and bioguideId are required' }, { status: 400 })
    }

    // Call Claude API to analyze the promise
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a nonpartisan political fact-checker analyzing whether a politician kept a campaign promise.

Promise made: "${promiseText}"

Recent sponsored bills:
${bills?.slice(0, 10).map(b => `- ${b.number}: ${b.title}`).join('\n') || 'No bill data available'}

Based on this information, analyze whether this promise has been:
- KEPT: Clear evidence of fulfillment through legislation or action
- BROKEN: Clear evidence of acting against the promise
- IN_PROGRESS: Working toward it but not complete
- UNVERIFIABLE: Cannot determine from available data

Respond in this exact JSON format only, no other text:
{
  "status": "KEPT" or "BROKEN" or "IN_PROGRESS" or "UNVERIFIABLE",
  "reasoning": "2-3 sentence nonpartisan explanation of your determination",
  "confidence": "HIGH" or "MEDIUM" or "LOW"
}`
          }
        ]
      })
    })

    const aiData = await response.json()
    const content = aiData.content?.[0]?.text || ''

    let analysis
    try {
      const clean = content.replace(/```json|```/g, '').trim()
      analysis = JSON.parse(clean)
    } catch {
      analysis = {
        status: 'UNVERIFIABLE',
        reasoning: 'Could not analyze promise automatically.',
        confidence: 'LOW'
      }
    }

    const statusMap = {
      'KEPT': 'Kept',
      'BROKEN': 'Broken',
      'IN_PROGRESS': 'In Progress',
      'UNVERIFIABLE': 'Unverifiable',
    }

    // Update the promise in Supabase if promiseId provided
    if (promiseId) {
      await supabase
        .from('promises')
        .update({
          status: statusMap[analysis.status] || 'Unverifiable',
          ai_reasoning: `${analysis.reasoning} (Confidence: ${analysis.confidence})`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', promiseId)
    }

    return Response.json({
      status: statusMap[analysis.status] || 'Unverifiable',
      reasoning: analysis.reasoning,
      confidence: analysis.confidence,
    })
  } catch (error) {
    console.error('Promise analysis error:', error)
    return Response.json({ error: 'Failed to analyze promise' }, { status: 500 })
  }
}

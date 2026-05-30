export const dynamic = 'force-dynamic'

export async function POST(request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  try {
    const { answers, topMatch, topMatchAlignment } = await request.json()

    if (!answers) {
      return Response.json({ error: 'Answers are required' }, { status: 400 })
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/survey_responses`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        answers,
        top_match: topMatch || null,
        top_match_alignment: topMatchAlignment || null,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Supabase error:', text)
      return Response.json({ error: 'Failed to save response' }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Survey save error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

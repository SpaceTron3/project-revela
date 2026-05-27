export const dynamic = 'force-dynamic'

export async function POST(request) {
  const { email } = await request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const text = await res.text()
      // Check if it's a duplicate email
      if (text.includes('duplicate') || text.includes('unique')) {
        return Response.json({ success: true }) // Already on list, that's fine
      }
      return Response.json({ error: 'Failed to save email' }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Waitlist error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

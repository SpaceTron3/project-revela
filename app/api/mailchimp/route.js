export const dynamic = 'force-dynamic'

export async function POST(request) {
  const { email } = await request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
  const SERVER = 'us15'

  const url = `https://${SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`

  // Mailchimp requires Basic auth with any username and API key as password
  const credentials = Buffer.from(`anystring:${API_KEY}`).toString('base64')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    })

    const result = await response.json()
    console.log('Mailchimp response:', response.status, JSON.stringify(result).slice(0, 200))

    if (response.ok || result.title === 'Member Exists') {
      return Response.json({ success: true })
    }

    return Response.json({
      error: result.detail || result.title || 'Something went wrong'
    }, { status: 400 })
  } catch (error) {
    console.error('Mailchimp error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

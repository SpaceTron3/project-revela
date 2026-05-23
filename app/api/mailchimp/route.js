  const { email } = await request.json(); 
  if (!email || !email.includes('@')) { 
    return Response.json({ error: 'Valid email is required' }, { status: 400 }); 
  } 
  const API_KEY = process.env.MAILCHIMP_API_KEY; 
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID; 
  const SERVER = 'us15'; 
  const url = `https://${SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`; 
  try { 
    const response = await fetch(url, { method: 'POST', headers: { Authorization: `apikey ${API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email_address: email, status: 'subscribed' }) }); 
    const result = await response.json(); 
    if (response.ok || result.title === 'Member Exists') return Response.json({ success: true }); 
    return Response.json({ error: result.detail || 'Something went wrong' }, { status: 400 }); 
  } catch (error) { 
    return Response.json({ error: 'Server error' }, { status: 500 }); 
  } 
} 

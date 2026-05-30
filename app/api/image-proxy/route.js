export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return new Response('Missing url parameter', { status: 400 })
  }

  // Only allow image domains we trust
  const allowed = [
    'upload.wikimedia.org',
    'www.naag.org',
    'files.floridados.gov',
    'flsenate.gov',
    'myfloridahouse.gov',
    'www.flgov.com',
    'bioguide.congress.gov',
    'admin.cdn.sos.ca.gov',
    'flagpedia.net',
  ]

  const hostname = new URL(url).hostname
  if (!allowed.includes(hostname)) {
    return new Response('Domain not allowed', { status: 403 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProjectRevela/1.0)',
        'Referer': 'https://www.projectrevela.org',
      },
    })

    if (!res.ok) {
      return new Response('Image fetch failed', { status: 502 })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = await res.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return new Response('Proxy error', { status: 500 })
  }
}

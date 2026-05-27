import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { searchParams } = new URL(request.url)
  const bioguideId = searchParams.get('bioguideId')

  if (!bioguideId) {
    return Response.json({ error: 'bioguideId is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('promises')
      .select('*')
      .eq('bioguide_id', bioguideId)
      .eq('verified', true)
      .order('date_made', { ascending: false })

    if (error) throw error

    const stats = {
      total: data.length,
      kept: data.filter(p => p.status === 'Kept').length,
      broken: data.filter(p => p.status === 'Broken').length,
      inProgress: data.filter(p => p.status === 'In Progress').length,
      unverifiable: data.filter(p => p.status === 'Unverifiable').length,
    }

    stats.fulfillmentRate = stats.total > 0
      ? Math.round((stats.kept / (stats.kept + stats.broken)) * 100)
      : null

    return Response.json({ promises: data, stats })
  } catch (error) {
    console.error('Promises API error:', error)
    return Response.json({ error: 'Failed to fetch promises' }, { status: 500 })
  }
}

'use client'
import { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function supabaseRequest(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=minimal',
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    let err
    try { err = JSON.parse(text) } catch { err = { message: text || 'Unknown error' } }
    throw new Error(err.message || 'Supabase error')
  }
  const text = await res.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

const CATEGORIES = [
  'Healthcare', 'Economy', 'Immigration', 'Defense', 'Education',
  'Climate', 'Taxes', 'Infrastructure', 'Criminal Justice', 'Foreign Policy',
  'Social Programs', 'Government Reform', 'Other'
]

const STATUS_STYLES = {
  'Kept': 'bg-green-50 text-green-700 border-green-200',
  'Broken': 'bg-red-50 text-red-700 border-red-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Unverifiable': 'bg-gray-50 text-gray-600 border-gray-200',
}

export default function AdminPromises() {
  const [promises, setPromises] = useState([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(null)
  const [form, setForm] = useState({
    bioguide_id: '',
    member_name: '',
    promise_text: '',
    category: 'Economy',
    source: '',
    source_url: '',
    date_made: '',
    status: 'In Progress',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPromises()
  }, [])

  async function fetchPromises() {
    setLoading(true)
    try {
      const data = await supabaseRequest('promises?order=created_at.desc')
      setPromises(data || [])
    } catch (err) {
      setMessage('Error loading promises: ' + err.message)
    }
    setLoading(false)
  }

  async function handleSubmit() {
    if (!form.bioguide_id || !form.promise_text || !form.member_name) {
      setMessage('Please fill in Bioguide ID, Member Name, and Promise Text')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/promises`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ ...form, verified: false }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to save')
      }
      setMessage('Promise saved! Review and verify it below.')
      setForm({ bioguide_id: '', member_name: '', promise_text: '', category: 'Economy', source: '', source_url: '', date_made: '', status: 'In Progress' })
      fetchPromises()
    } catch (err) {
      setMessage('Error saving promise: ' + err.message)
    }
    setSubmitting(false)
  }

  async function analyzeWithAI(promise) {
    setAnalyzing(promise.id)
    try {
      const billsRes = await fetch(`/api/congress/member/${promise.bioguide_id}/bills`)
      const billsData = await billsRes.json()

      const res = await fetch('/api/analyze-promise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promiseId: promise.id,
          bioguideId: promise.bioguide_id,
          promiseText: promise.promise_text,
          bills: billsData.bills || [],
        })
      })
      const data = await res.json()
      setMessage(`AI Analysis: ${data.status} — ${data.reasoning}`)
      fetchPromises()
    } catch (err) {
      setMessage('AI analysis failed: ' + err.message)
    }
    setAnalyzing(null)
  }

  async function updateStatus(id, status) {
    try {
      await supabaseRequest(`promises?id=eq.${id}`, {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
      })
      fetchPromises()
    } catch (err) {
      setMessage('Error updating status: ' + err.message)
    }
  }

  async function toggleVerified(id, verified) {
    try {
      await supabaseRequest(`promises?id=eq.${id}`, {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: JSON.stringify({ verified: !verified }),
      })
      fetchPromises()
    } catch (err) {
      setMessage('Error updating: ' + err.message)
    }
  }

  async function deletePromise(id) {
    if (!confirm('Delete this promise?')) return
    try {
      await supabaseRequest(`promises?id=eq.${id}`, {
        method: 'DELETE',
        prefer: 'return=minimal',
      })
      fetchPromises()
    } catch (err) {
      setMessage('Error deleting: ' + err.message)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

        <div className="mb-8">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-revela-blue bg-revela-blue-light px-4 py-2 rounded-full mb-4">
            Admin
          </span>
          <h1 className="font-display text-4xl font-bold text-revela-navy">Promise Tracker</h1>
          <p className="text-gray-500 mt-2">Add and manage campaign promises. Use AI to analyze fulfillment, then verify before publishing.</p>
        </div>

        {message && (
          <div className="bg-revela-blue-light border border-revela-blue/20 rounded-xl p-4 mb-6 text-sm text-revela-navy">
            {message}
            <button onClick={() => setMessage('')} className="ml-4 text-revela-blue hover:underline">Dismiss</button>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-bold text-revela-navy mb-5">Add New Promise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Bioguide ID *</label>
              <input
                type="text"
                placeholder="e.g. C001098"
                value={form.bioguide_id}
                onChange={e => setForm({...form, bioguide_id: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Member Name *</label>
              <input
                type="text"
                placeholder="e.g. Ted Cruz"
                value={form.member_name}
                onChange={e => setForm({...form, member_name: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Promise Text *</label>
            <textarea
              placeholder="Enter the exact promise made by the candidate..."
              value={form.promise_text}
              onChange={e => setForm({...form, promise_text: e.target.value})}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue bg-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Source</label>
              <input
                type="text"
                placeholder="e.g. Campaign website"
                value={form.source}
                onChange={e => setForm({...form, source: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Date Made</label>
              <input
                type="date"
                value={form.date_made}
                onChange={e => setForm({...form, date_made: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-revela-blue text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-revela-blue-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Promise'}
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold text-revela-navy mb-5">
            All Promises ({promises.length})
          </h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"/>)}
            </div>
          ) : promises.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No promises added yet. Add your first one above!</p>
          ) : (
            <div className="space-y-4">
              {promises.map(p => (
                <div key={p.id} className={`border rounded-xl p-4 ${p.verified ? 'border-green-100 bg-green-50/30' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-medium text-revela-navy">{p.member_name}</span>
                        <span className="text-xs text-gray-400">{p.bioguide_id}</span>
                        <span className="text-xs text-revela-blue bg-revela-blue-light px-2 py-0.5 rounded-full">{p.category}</span>
                        {p.verified && <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">✓ Published</span>}
                      </div>
                      <p className="text-sm text-gray-700 leading-snug">{p.promise_text}</p>
                      {p.ai_reasoning && (
                        <p className="text-xs text-gray-500 mt-2 italic">AI: {p.ai_reasoning}</p>
                      )}
                      {p.source && <p className="text-xs text-gray-400 mt-1">Source: {p.source}</p>}
                    </div>
                    <div className="shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[p.status] || STATUS_STYLES['Unverifiable']}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => analyzeWithAI(p)}
                      disabled={analyzing === p.id}
                      className="text-xs text-revela-blue border border-revela-blue/30 px-3 py-1.5 rounded-lg hover:bg-revela-blue-light transition-colors disabled:opacity-50"
                    >
                      {analyzing === p.id ? '🤖 Analyzing...' : '🤖 Analyze with AI'}
                    </button>
                    {['Kept', 'Broken', 'In Progress', 'Unverifiable'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(p.id, status)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          p.status === status ? STATUS_STYLES[status] : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      onClick={() => toggleVerified(p.id, p.verified)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        p.verified ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-200 text-gray-500 hover:border-green-300'
                      }`}
                    >
                      {p.verified ? '✓ Published' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deletePromise(p.id)}
                      className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

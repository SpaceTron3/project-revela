'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { STATE_FACTS } from '../../../lib/stateFacts'

function StatBadge({ label, value, icon }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center hover:border-revela-blue/30 hover:shadow-sm transition-all">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-display text-lg font-bold text-revela-navy mb-1">{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
    </div>
  )
}

export default function StatePage({ params }) {
  const stateName = decodeURIComponent(params.state).replace(/-/g, ' ')
    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const facts = STATE_FACTS[stateName]
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizCorrect, setQuizCorrect] = useState(false)
  const [revealedCeleb, setRevealedCeleb] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(`/api/congress/members/by-state?state=${encodeURIComponent(stateName)}`)
        const data = await res.json()
        setMembers(data.members || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (stateName) fetchMembers()
  }, [stateName])

  if (!facts) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-28 text-center">
          <h1 className="font-display text-3xl font-bold text-revela-navy mb-4">State not found</h1>
          <Link href="/map" className="text-revela-blue hover:underline">← Back to map</Link>
        </div>
      </main>
    )
  }

  function getLatestTerm(m) {
    const terms = m.terms?.item || m.terms || []
    const arr = Array.isArray(terms) ? terms : [terms]
    return arr[arr.length - 1]
  }

  function isCurrentMember(m) {
    const t = getLatestTerm(m)
    return !t?.endYear || t.endYear >= 2025
  }

  const senators = members.filter(m => {
    const t = getLatestTerm(m)
    return t?.chamber === 'Senate' && isCurrentMember(m)
  })

  const representatives = members.filter(m => {
    const t = getLatestTerm(m)
    return t?.chamber === 'House of Representatives' && isCurrentMember(m)
  })

  function partyStyle(partyName) {
    if (partyName === 'Republican') return { bg: 'bg-red-50', text: 'text-red-700', label: 'R' }
    if (partyName === 'Democratic') return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'D' }
    return { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'I' }
  }

  const quizOptions = [facts.bird, 'Bald Eagle', 'Cardinal', 'Robin'].sort(() => Math.random() - 0.5)

  const TABS = [
    { id: 'overview', label: '🗺️ Overview' },
    { id: 'representatives', label: '🏛️ Representatives' },
    { id: 'funfacts', label: '🎯 Fun Facts' },
    { id: 'celebrities', label: '⭐ Notable People' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

        <Link href="/map" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-revela-blue transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to map
        </Link>

        {/* Hero */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-1">
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-revela-blue bg-revela-blue-light px-4 py-2 rounded-full mb-4">
                {facts.nickname}
              </span>
              <h1 className="font-display text-5xl font-bold text-revela-navy mb-2">{stateName}</h1>
              <p className="text-gray-500 text-lg mb-4">Capital: {facts.capital} · {facts.electoralVotes} Electoral Votes</p>
              <div className="flex flex-wrap gap-3">
                <span className="text-sm bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-600">
                  👥 {facts.population} residents
                </span>
                <span className="text-sm bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-600">
                  🗓️ Founded {facts.founded}
                </span>
                <span className="text-sm bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-gray-600">
                  #{facts.statehood} state
                </span>
              </div>
            </div>
            <div className="bg-revela-blue-light rounded-2xl p-6 text-center shrink-0">
              <div className="font-display text-6xl font-bold text-revela-blue">{facts.code}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">State Code</div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatBadge icon="🐦" label="State Bird" value={facts.bird} />
          <StatBadge icon="🌸" label="State Flower" value={facts.flower} />
          <StatBadge icon="🌳" label="State Tree" value={facts.tree} />
          <StatBadge icon="🗳️" label="Electoral Votes" value={facts.electoralVotes} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-revela-blue text-white'
                  : 'bg-white border border-gray-100 text-gray-500 hover:border-revela-blue/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-revela-navy mb-4">State Motto</h2>
              <blockquote className="font-display text-2xl font-bold text-revela-blue italic mb-2">
                "{facts.motto}"
              </blockquote>
            </div>

            {/* Interactive Quiz */}
            <div className="bg-revela-navy rounded-2xl p-6 text-white">
              <p className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-2">Quick Quiz</p>
              <h2 className="font-display text-2xl font-bold text-white mb-6">
                What is {stateName}'s state bird?
              </h2>
              {!quizAnswered ? (
                <div className="grid grid-cols-2 gap-3">
                  {quizOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswered(true)
                        setQuizCorrect(option === facts.bird)
                      }}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-colors text-left"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`rounded-xl p-4 ${quizCorrect ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
                  <p className="font-medium text-white text-lg mb-1">
                    {quizCorrect ? '🎉 Correct!' : '❌ Not quite!'}
                  </p>
                  <p className="text-blue-200 text-sm">
                    {stateName}'s state bird is the <strong className="text-white">{facts.bird}</strong>.
                  </p>
                  <button
                    onClick={() => setQuizAnswered(false)}
                    className="mt-3 text-xs text-blue-300 hover:text-white transition-colors underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Representatives Tab */}
        {activeTab === 'representatives' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-revela-navy mb-5">U.S. Senators</h2>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"/>)}
                </div>
              ) : senators.length === 0 ? (
                <p className="text-sm text-gray-400">No senators found.</p>
              ) : (
                <div className="space-y-3">
                  {senators.map(m => {
                    const p = partyStyle(m.partyName)
                    return (
                      <Link
                        key={m.bioguideId}
                        href={`/congress/${m.bioguideId}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                      >
                        <img
                          src={m.depiction?.imageUrl || `https://bioguide.congress.gov/bioguide/photo/${m.bioguideId[0]}/${m.bioguideId}.jpg`}
                          className="w-12 h-12 rounded-full object-cover bg-gray-100 shrink-0"
                          onError={e => { e.target.style.display='none' }}
                          alt={m.name}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-revela-navy">{m.name}</p>
                          <p className="text-xs text-gray-400">U.S. Senator</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${p.bg} ${p.text}`}>{p.label}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-display text-xl font-bold text-revela-navy">House Representatives</h2>
                <span className="text-sm text-gray-400">{representatives.length} members</span>
              </div>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg"/>)}
                </div>
              ) : representatives.length === 0 ? (
                <p className="text-sm text-gray-400">No representatives found.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {representatives.map(m => {
                    const p = partyStyle(m.partyName)
                    return (
                      <Link
                        key={m.bioguideId}
                        href={`/congress/${m.bioguideId}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-sm text-revela-navy">{m.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.bg} ${p.text}`}>{p.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fun Facts Tab */}
        {activeTab === 'funfacts' && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-revela-navy mb-6">Did You Know?</h2>
              <div className="bg-revela-blue-light border border-revela-blue/20 rounded-xl p-6 mb-6">
                <div className="text-3xl mb-3">💡</div>
                <p className="text-revela-navy text-base leading-relaxed font-medium">{facts.funFact}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">State Bird</p>
                  <p className="text-sm font-medium text-revela-navy">🐦 {facts.bird}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">State Flower</p>
                  <p className="text-sm font-medium text-revela-navy">🌸 {facts.flower}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">State Tree</p>
                  <p className="text-sm font-medium text-revela-navy">🌳 {facts.tree}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Founded</p>
                  <p className="text-sm font-medium text-revela-navy">🗓️ {facts.founded}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Population</p>
                  <p className="text-sm font-medium text-revela-navy">👥 {facts.population}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Electoral Votes</p>
                  <p className="text-sm font-medium text-revela-navy">🗳️ {facts.electoralVotes} votes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Celebrities Tab */}
        {activeTab === 'celebrities' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-revela-navy mb-2">Notable People from {stateName}</h2>
            <p className="text-sm text-gray-400 mb-6">Click each name to reveal why they're famous.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facts.celebrities.map((celeb, i) => (
                <button
                  key={i}
                  onClick={() => setRevealedCeleb(revealedCeleb === celeb ? null : celeb)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${
                    revealedCeleb === celeb
                      ? 'border-revela-blue bg-revela-blue-light'
                      : 'border-gray-100 hover:border-revela-blue/30 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-revela-navy text-sm">{celeb}</span>
                    <span className="text-revela-blue text-lg">{revealedCeleb === celeb ? '−' : '+'}</span>
                  </div>
                  {revealedCeleb === celeb && (
                    <p className="text-xs text-revela-blue mt-2">
                      Born in {stateName} · Notable figure in American history and culture
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { STATE_FACTS } from '../../../lib/stateFacts'
import { STATE_THEMES, getStateFlag } from '../../../lib/stateThemes'
import { PRESIDENTS_BY_STATE } from '../../../lib/presidentsByState'

function StatCard({ icon, label, value, accent, light, text }) {
  return (
    <div style={{ background: light, borderRadius: 12, padding: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: text }}>{value}</div>
      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export default function StatePage({ params }) {
  const stateName = decodeURIComponent(params.state)
    .replace(/-/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

  const facts = STATE_FACTS[stateName] || STATE_FACTS[
    Object.keys(STATE_FACTS).find(k => k.toLowerCase() === stateName.toLowerCase())
  ]

  const theme = STATE_THEMES[stateName] || { from: '#185FA5', to: '#0C447C', accent: '#3b82f6', light: '#dbeafe', text: '#1e40af' }

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizCorrect, setQuizCorrect] = useState(false)
  const [revealedCeleb, setRevealedCeleb] = useState(null)

  const quizOptions = useMemo(() => {
    if (!facts) return []
    const wrong = ['Bald Eagle', 'Cardinal', 'Robin', 'Blue Jay', 'Mockingbird', 'Pelican', 'Flamingo']
      .filter(b => b !== facts.bird)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    return [...wrong, facts.bird].sort(() => Math.random() - 0.5)
  }, [facts])

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

  const flagUrl = getStateFlag(facts.code)

  const TABS = [
    { id: 'overview', label: '🗺️ Overview' },
    { id: 'representatives', label: '🏛️ Representatives' },
    { id: 'funfacts', label: '🎯 Fun Facts' },
    { id: 'celebrities', label: '⭐ Notable People' },
    { id: 'presidents', label: '🇺🇸 Presidents' },
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
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
            borderRadius: 20,
            padding: '2rem',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', bottom: -30, right: -30, width: 250, height: 250, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: -50, right: 80, width: 150, height: 150, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7, color: 'white', display: 'block', marginBottom: 6 }}>
                State of {stateName}
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>
                {stateName}
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>
                {facts.nickname}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  `👥 ${facts.population}`,
                  `🏛️ ${facts.capital}`,
                  `🗳️ ${facts.electoralVotes} Electoral Votes`,
                  `#${facts.statehood} State`,
                ].map(pill => (
                  <span key={pill} style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '0.5px solid rgba(255,255,255,0.25)',
                    padding: '4px 12px',
                    borderRadius: 100,
                    fontSize: 12,
                    color: 'white',
                  }}>
                    {pill}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <img
                src={flagUrl}
                alt={`${stateName} state flag`}
                style={{
                  width: 130,
                  height: 87,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '2px solid rgba(255,255,255,0.35)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>
                State Flag
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1.5rem' }}>
          <StatCard icon="🐦" label="State Bird" value={facts.bird} accent={theme.accent} light={theme.light} text={theme.text} />
          <StatCard icon="🌸" label="State Flower" value={facts.flower} accent={theme.accent} light={theme.light} text={theme.text} />
          <StatCard icon="🌳" label="State Tree" value={facts.tree} accent={theme.accent} light={theme.light} text={theme.text} />
          <StatCard icon="📜" label="Founded" value={facts.founded.split(',')[1]?.trim() || facts.founded} accent={theme.accent} light={theme.light} text={theme.text} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'
              }`}
              style={activeTab === tab.id ? { background: theme.from } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Motto */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: theme.text }}>State Motto</p>
              <blockquote className="font-display text-2xl font-bold" style={{ color: theme.from }}>
                "{facts.motto}"
              </blockquote>
            </div>

            {/* Quiz */}
            <div style={{ background: theme.to, borderRadius: 20, padding: '1.5rem' }}>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: theme.accent, marginBottom: 8 }}>
                Quick Quiz
              </p>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'white', marginBottom: 16 }}>
                What is {stateName}'s state bird?
              </h2>
              {!quizAnswered ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {quizOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setQuizAnswered(true)
                        setQuizCorrect(option === facts.bird)
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '0.5px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '10px 14px',
                        borderRadius: 10,
                        fontSize: 13,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: quizCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                  border: `0.5px solid ${quizCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                  borderRadius: 12,
                  padding: '1rem',
                }}>
                  <p style={{ color: 'white', fontWeight: 600, marginBottom: 4 }}>
                    {quizCorrect ? '🎉 Correct!' : '❌ Not quite!'}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                    {stateName}'s state bird is the <strong style={{ color: 'white' }}>{facts.bird}</strong>.
                  </p>
                  <button
                    onClick={() => setQuizAnswered(false)}
                    style={{ color: theme.accent, fontSize: 12, marginTop: 8, textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
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
          <div className="space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-revela-navy mb-5">U.S. Senators</h2>
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl"/>)}
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
                  {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg"/>)}
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
          <div className="space-y-5">
            <div
              style={{
                background: theme.light,
                border: `0.5px solid ${theme.accent}40`,
                borderRadius: 20,
                padding: '1.5rem',
              }}
            >
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: theme.text, marginBottom: 8 }}>
                💡 Did you know?
              </p>
              <p style={{ fontSize: 16, color: theme.from, lineHeight: 1.7, fontWeight: 500 }}>
                {facts.funFact}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-revela-navy mb-5">State Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'State Bird', value: `🐦 ${facts.bird}` },
                  { label: 'State Flower', value: `🌸 ${facts.flower}` },
                  { label: 'State Tree', value: `🌳 ${facts.tree}` },
                  { label: 'Capital City', value: `🏛️ ${facts.capital}` },
                  { label: 'Population', value: `👥 ${facts.population}` },
                  { label: 'Founded', value: `🗓️ ${facts.founded}` },
                  { label: 'Statehood Order', value: `#${facts.statehood}` },
                  { label: 'Electoral Votes', value: `🗳️ ${facts.electoralVotes}` },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-revela-navy">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-revela-navy mb-4">State Motto</h2>
              <blockquote
                className="font-display text-2xl font-bold"
                style={{ color: theme.from }}
              >
                "{facts.motto}"
              </blockquote>
            </div>
          </div>
        )}

        {/* Celebrities Tab */}
        {activeTab === 'celebrities' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-revela-navy mb-2">
              Notable People from {stateName}
            </h2>
            <p className="text-sm text-gray-400 mb-6">Tap each card to learn more.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {facts.celebrities.map((celeb, i) => (
                <button
                  key={i}
                  onClick={() => setRevealedCeleb(revealedCeleb === celeb ? null : celeb)}
                  className="text-left px-5 py-4 rounded-xl border transition-all"
                  style={{
                    borderColor: revealedCeleb === celeb ? theme.accent : '#f3f4f6',
                    background: revealedCeleb === celeb ? theme.light : 'white',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-revela-navy text-sm">{celeb}</span>
                    <span style={{ color: theme.text, fontSize: 18 }}>{revealedCeleb === celeb ? '−' : '+'}</span>
                  </div>
                  {revealedCeleb === celeb && (
                    <p className="text-xs mt-2" style={{ color: theme.text }}>
                      Born in {stateName} · Notable figure in American history and culture
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Presidents Tab */}
        {activeTab === 'presidents' && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold text-revela-navy mb-2">
              Presidents Born in {stateName}
            </h2>
            {(() => {
              const presidents = PRESIDENTS_BY_STATE[stateName] || []
              if (presidents.length === 0) {
                return (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">🏛️</div>
                    <p className="text-gray-500 text-sm">No U.S. presidents were born in {stateName}.</p>
                    <p className="text-gray-400 text-xs mt-2">Virginia leads with 8 presidents, followed by Ohio with 7.</p>
                  </div>
                )
              }
              return (
                <>
                  <p className="text-sm text-gray-400 mb-6">{presidents.length} president{presidents.length !== 1 ? 's' : ''} {presidents.length !== 1 ? 'have' : 'has'} roots in {stateName}.</p>
                  <div className="space-y-4">
                    {presidents.map((p, i) => (
                      <div
                        key={i}
                        style={{ background: theme.light, borderRadius: 16, padding: '1rem' }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            style={{
                              background: theme.from,
                              color: 'white',
                              borderRadius: 10,
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 14,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {p.number ? `#${p.number}` : 'VP'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-display text-base font-bold text-revela-navy">{p.name}</h3>
                              <span
                                style={{
                                  fontSize: 11,
                                  padding: '2px 8px',
                                  borderRadius: 100,
                                  background: p.party === 'Democrat' ? '#dbeafe' : p.party === 'Republican' ? '#fee2e2' : '#f3f4f6',
                                  color: p.party === 'Democrat' ? '#1e40af' : p.party === 'Republican' ? '#991b1b' : '#374151',
                                }}
                              >
                                {p.party}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{p.years}</p>
                            <p className="text-xs text-gray-400 mt-1">Born: {p.born}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
            <p className="text-xs text-gray-400 mt-6">Some presidents represented a state different from their birthplace.</p>
          </div>
        )}

      </div>
    </main>
  )
}

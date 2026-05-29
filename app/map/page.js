'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import USMap from '../../components/USMap'

const MIDTERM_DATE = new Date('2026-11-03T00:00:00')
const daysLeft = Math.ceil((MIDTERM_DATE - new Date()) / (1000 * 60 * 60 * 24))

export default function MapPage() {
  const [selectedState, setSelectedState] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleStateSelect(state) {
    setSelectedState(state)
    setLoading(true)
    setMembers([])
    try {
      const res = await fetch(`/api/congress/members/by-state?state=${encodeURIComponent(state.name)}`)
      const data = await res.json()
      setMembers(data.members || [])
    } catch (err) {
      console.error(err)
      setMembers([])
    } finally {
      setLoading(false)
    }
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">

        <div className="mb-10">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-revela-blue bg-revela-blue-light px-4 py-2 rounded-full mb-4">
            Interactive map
          </span>
          <h1 className="font-display text-4xl font-bold text-revela-navy mb-2">
            Find your representatives
          </h1>
          <p className="text-gray-500">Click your state to see who represents you in Congress and what elections are coming up.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <USMap onStateSelect={handleStateSelect} selectedState={selectedState?.name} />
              <p className="text-center text-sm text-gray-400 mt-3">
                {selectedState ? `${selectedState.name} selected` : 'Click any state to explore'}
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="bg-revela-navy rounded-2xl p-5 text-center">
              <p className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-2">2026 Midterm Elections</p>
              <div className="font-display text-5xl font-bold text-white mb-1">{daysLeft}</div>
              <p className="text-blue-200 text-sm mb-3">days remaining</p>
              <p className="text-xs text-blue-300 mb-3">November 3, 2026</p>
              <a
                href="https://vote.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-medium bg-revela-blue text-white px-4 py-2 rounded-lg hover:bg-revela-blue-dark transition-colors"
              >
                Are you registered to vote? →
              </a>
            </div>

            {!selectedState && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
                <div className="w-12 h-12 rounded-full bg-revela-blue-light flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Select a state on the map to see its senators, representatives, and upcoming elections.</p>
              </div>
            )}

            {selectedState && loading && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-1/2"/>
                  <div className="h-4 bg-gray-100 rounded w-3/4"/>
                  <div className="h-4 bg-gray-100 rounded w-2/3"/>
                </div>
              </div>
            )}

            {selectedState && !loading && (
              <>
                {/* State Page Link */}
                <Link
                  href={`/states/${encodeURIComponent(selectedState.name)}`}
                  className="flex items-center justify-between bg-white border border-revela-blue/30 rounded-2xl p-4 hover:bg-revela-blue-light transition-colors group"
                >
                  <div>
                    <p className="font-medium text-revela-navy text-sm">{selectedState.name} State Page</p>
                    <p className="text-xs text-gray-400">Facts, history, flag & more</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" className="shrink-0 group-hover:translate-x-1 transition-transform">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Link>

                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <h3 className="font-display text-base font-bold text-revela-navy mb-4">
                    {selectedState.name} — Senators
                  </h3>
                  {senators.length === 0 ? (
                    <p className="text-sm text-gray-400">No senators found.</p>
                  ) : (
                    <div className="space-y-3">
                      {senators.map(m => {
                        const p = partyStyle(m.partyName)
                        return (
                          <Link
                            key={m.bioguideId}
                            href={`/congress/${m.bioguideId}`}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <img
                              src={m.depiction?.imageUrl || `https://bioguide.congress.gov/bioguide/photo/${m.bioguideId[0]}/${m.bioguideId}.jpg`}
                              className="w-10 h-10 rounded-full object-cover bg-gray-100 shrink-0"
                              onError={e => { e.target.style.display='none' }}
                              alt={m.name}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-revela-navy truncate">{m.name}</p>
                              <p className="text-xs text-gray-400">U.S. Senator</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${p.bg} ${p.text}`}>{p.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>

                {representatives.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h3 className="font-display text-base font-bold text-revela-navy mb-1">
                      House Representatives
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">{representatives.length} shown</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {representatives.map(m => {
                        const p = partyStyle(m.partyName)
                        return (
                          <Link
                            key={m.bioguideId}
                            href={`/congress/${m.bioguideId}`}
                            className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-sm text-revela-navy truncate">{m.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ml-2 shrink-0 ${p.bg} ${p.text}`}>{p.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                    <Link
                      href="/congress"
                      className="block text-center text-sm text-revela-blue mt-4 hover:underline"
                    >
                      View full Congress directory →
                    </Link>
                  </div>
                )}

                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                  <h3 className="font-display text-base font-bold text-revela-navy mb-4">Upcoming elections</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <div>
                        <p className="text-sm font-medium text-revela-navy">Primary Election</p>
                        <p className="text-xs text-gray-400">{selectedState.name}</p>
                      </div>
                      <span className="text-xs text-revela-blue font-medium">Aug 18, 2026</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-sm font-medium text-revela-navy">General Midterm Election</p>
                        <p className="text-xs text-gray-400">Federal + State races</p>
                      </div>
                      <span className="text-xs text-revela-blue font-medium">Nov 3, 2026</span>
                    </div>
                  </div>
                  <a
                    href="https://vote.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm font-medium text-white bg-revela-blue px-4 py-2 rounded-lg mt-4 hover:bg-revela-blue-dark transition-colors"
                  >
                    Register to vote →
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

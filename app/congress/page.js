'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const PARTY_COLORS = {
  R: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', label: 'Republican' },
  D: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Democrat' },
  I: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', label: 'Independent' },
}

function MemberCard({ member }) {
  const party = PARTY_COLORS[member.partyName?.[0]] || PARTY_COLORS.I
  const chamber = member.terms?.item?.[member.terms.item.length - 1]?.chamber || ''
  const isSenator = chamber === 'Senate'

  return (
    <Link href={`/congress/${member.bioguideId}`}>
      <div className="border border-gray-100 rounded-2xl p-5 hover:border-revela-blue/30 hover:shadow-md transition-all cursor-pointer bg-white group">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={`https://bioguide.congress.gov/bioguide/photo/${member.bioguideId[0]}/${member.bioguideId}.jpg`}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = `<span class="text-xl font-bold text-gray-400">${member.name?.[0] || '?'}</span>`
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-revela-navy text-sm leading-tight group-hover:text-revela-blue transition-colors truncate">
              {member.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{member.state} · {isSenator ? 'Senator' : 'Representative'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${party.bg} ${party.text} ${party.border}`}>
                {party.label}
              </span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-revela-blue transition-colors shrink-0 mt-1">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function CongressDirectory() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [party, setParty] = useState('ALL')
  const [chamber, setChamber] = useState('ALL')
  const [page, setPage] = useState(0)
  const PER_PAGE = 60

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true)
      try {
        const res = await fetch(`/api/congress/members?offset=${page * PER_PAGE}&limit=${PER_PAGE}&party=${party}&chamber=${chamber}`)
        const data = await res.json()
        setMembers(data.members || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [page, party, chamber])

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.state?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-revela-blue bg-revela-blue-light px-4 py-2 rounded-full mb-4">
            Congressional Directory
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-revela-navy mb-3">
            Your Representatives
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Browse verified profiles for every member of the U.S. Congress — voting records, funding sources, and more.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue"
          />
          <select
            value={party}
            onChange={e => { setParty(e.target.value); setPage(0) }}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue bg-white"
          >
            <option value="ALL">All Parties</option>
            <option value="D">Democrat</option>
            <option value="R">Republican</option>
            <option value="I">Independent</option>
          </select>
          <select
            value={chamber}
            onChange={e => { setChamber(e.target.value); setPage(0) }}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-revela-blue bg-white"
          >
            <option value="ALL">Both Chambers</option>
            <option value="Senate">Senate</option>
            <option value="House">House</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 bg-white animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-100"/>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"/>
                    <div className="h-3 bg-gray-100 rounded w-1/2 mb-3"/>
                    <div className="h-5 bg-gray-100 rounded w-24"/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{filtered.length} members shown</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(member => (
                <MemberCard key={member.bioguideId} member={member} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-revela-blue hover:text-revela-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="px-5 py-2.5 text-sm text-gray-400">Page {page + 1}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={filtered.length < PER_PAGE}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-revela-blue hover:text-revela-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

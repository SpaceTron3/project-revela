'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'

const PARTY_COLORS = {
  R: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', label: 'Republican' },
  D: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', label: 'Democrat' },
  I: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', label: 'Independent' },
}

function formatMoney(amount) {
  if (!amount) return '$0'
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount.toFixed(0)}`
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
      <div className="font-display text-3xl font-bold text-revela-blue mb-1">{value}</div>
      <div className="text-sm font-medium text-revela-navy">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-revela-blue-light flex items-center justify-center text-revela-blue">
        {icon}
      </div>
      <h2 className="font-display text-xl font-bold text-revela-navy">{title}</h2>
    </div>
  )
}

function FundingBar({ label, amount, max }) {
  const pct = max > 0 ? Math.min((amount / max) * 100, 100) : 0
  return (
    <div className="py-2 border-b border-gray-50 last:border-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-revela-navy truncate pr-4">{label}</span>
        <span className="text-sm font-medium text-revela-blue shrink-0">{formatMoney(amount)}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-revela-blue rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function MemberProfile({ params }) {
  const { bioguideId } = params
  const [member, setMember] = useState(null)
  const [votes, setVotes] = useState([])
  const [bills, setBills] = useState([])
  const [finance, setFinance] = useState(null)
  const [financeLoading, setFinanceLoading] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [memberRes, votesRes, billsRes] = await Promise.all([
          fetch(`/api/congress/member/${bioguideId}`),
          fetch(`/api/congress/member/${bioguideId}/votes`),
          fetch(`/api/congress/member/${bioguideId}/bills`),
        ])
        const memberData = await memberRes.json()
        const votesData = await votesRes.json()
        const billsData = await billsRes.json()
        setMember(memberData.member)
        setVotes(votesData.votes || [])
        setBills(billsData.bills || [])

        // Fetch FEC data after we have member info
        if (memberData.member) {
          const m = memberData.member
          const fecRes = await fetch(
            `/api/fec?name=${encodeURIComponent(m.directOrderName || m.invertedOrderName || '')}&state=${m.state || ''}`
          )
          const fecData = await fecRes.json()
          setFinance(fecData.finance)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
        setFinanceLoading(false)
      }
    }
    fetchData()
  }, [bioguideId])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-28">
          <div className="animate-pulse">
            <div className="flex gap-6 mb-10">
              <div className="w-28 h-28 rounded-full bg-gray-200"/>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"/>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"/>
                <div className="h-6 bg-gray-200 rounded w-24"/>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl"/>)}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-28 text-center">
          <h1 className="font-display text-3xl font-bold text-revela-navy mb-4">Member not found</h1>
          <Link href="/congress" className="text-revela-blue hover:underline">← Back to directory</Link>
        </div>
      </main>
    )
  }

  const party = PARTY_COLORS[member.partyHistory?.[0]?.partyAbbreviation] || PARTY_COLORS.I
  const latestTerm = member.terms?.[member.terms.length - 1] || {}
  const isSenator = latestTerm.memberType === 'Senator'
  const yearsInOffice = latestTerm.startYear ? new Date().getFullYear() - latestTerm.startYear : '—'
  const totalTerms = member.terms?.length || '—'

  const maxContributor = finance?.contributors?.[0]?.total || 0
  const maxIndustry = finance?.industries?.[0]?.total || 0

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* Back link */}
        <Link href="/congress" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-revela-blue transition-colors mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back to directory
        </Link>

        {/* Profile header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden shrink-0 border-4 border-revela-blue-light">
              <img
                src={`https://bioguide.congress.gov/bioguide/photo/${bioguideId[0]}/${bioguideId}.jpg`}
                alt={member.directOrderName}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-4xl font-bold text-gray-300">${member.directOrderName?.[0] || '?'}</span></div>`
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-revela-navy">
                  {member.directOrderName}
                </h1>
                <span className={`text-sm font-medium px-3 py-1 rounded-full border mt-1 ${party.bg} ${party.text} ${party.border}`}>
                  {party.label}
                </span>
              </div>
              <p className="text-gray-500 mb-4">
                {isSenator ? 'U.S. Senator' : 'U.S. Representative'} · {member.state}
                {!isSenator && latestTerm.district ? `, District ${latestTerm.district}` : ''}
              </p>
              <div className="flex flex-wrap gap-3">
                {member.officialWebsiteUrl && (
                  <a
                    href={member.officialWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-revela-blue border border-revela-blue/20 px-4 py-2 rounded-lg hover:bg-revela-blue-light transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Official Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard label="Years in Office" value={yearsInOffice} sub={`Since ${latestTerm.startYear || '—'}`} />
          <StatCard label="Total Terms" value={totalTerms} sub="Served" />
          <StatCard label="Bills Sponsored" value={bills.length || '—'} sub="This congress" />
          <StatCard label="Recent Votes" value={votes.length || '—'} sub="On record" />
        </div>

        {/* Campaign Finance */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <SectionHeader
            title="Campaign Finance"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />

          {financeLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/2"/>
              <div className="h-4 bg-gray-100 rounded w-1/3"/>
            </div>
          ) : !finance ? (
            <p className="text-sm text-gray-400">No FEC campaign finance data found for this member.</p>
          ) : (
            <>
              {/* Finance summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="font-display text-2xl font-bold text-revela-blue">{formatMoney(finance.totalRaised)}</div>
                  <div className="text-xs text-gray-500 mt-1">Total Raised</div>
                  {finance.cycle && <div className="text-xs text-gray-400">{finance.cycle} cycle</div>}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="font-display text-2xl font-bold text-revela-navy">{formatMoney(finance.totalSpent)}</div>
                  <div className="text-xs text-gray-500 mt-1">Total Spent</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="font-display text-2xl font-bold text-green-600">{formatMoney(finance.cashOnHand)}</div>
                  <div className="text-xs text-gray-500 mt-1">Cash on Hand</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Top contributors */}
                {finance.contributors?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-revela-navy mb-3">Top Donors</h3>
                    <div>
                      {finance.contributors.slice(0, 8).map((c, i) => (
                        <FundingBar key={i} label={c.name} amount={c.total} max={maxContributor} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Top industries */}
                {finance.industries?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-revela-navy mb-3">Top Industries</h3>
                    <div>
                      {finance.industries.slice(0, 8).map((ind, i) => (
                        <FundingBar key={i} label={ind.name || 'Unknown'} amount={ind.total} max={maxIndustry} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-4">Source: Federal Election Commission (FEC) public data</p>
            </>
          )}
        </div>

        {/* Leadership */}
        {member.leadership?.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <SectionHeader
              title="Leadership Roles"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
            />
            <div className="space-y-3">
              {member.leadership.map((role, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-revela-navy">{role.type}</span>
                  <span className="text-xs text-gray-400">Congress {role.congress}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent votes */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <SectionHeader
            title="Recent Votes"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
          />
          {votes.length === 0 ? (
            <p className="text-sm text-gray-400">No recent votes on record.</p>
          ) : (
            <div className="space-y-3">
              {votes.slice(0, 10).map((vote, i) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 pr-4">
                    <p className="text-sm text-revela-navy leading-snug">{vote.description || 'Vote recorded'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{vote.date}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    vote.votePosition === 'Yes' ? 'bg-green-50 text-green-600' :
                    vote.votePosition === 'No' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {vote.votePosition || '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sponsored bills */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <SectionHeader
            title="Sponsored Legislation"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          />
          {bills.length === 0 ? (
            <p className="text-sm text-gray-400">No sponsored bills on record.</p>
          ) : (
            <div className="space-y-3">
              {bills.slice(0, 10).map((bill, i) => (
                <div key={i} className="py-2 border-b border-gray-50 last:border-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm font-medium text-revela-navy">{bill.number}</p>
                      <p className="text-sm text-gray-500 leading-snug mt-0.5">{bill.title}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                      bill.latestAction?.text?.toLowerCase().includes('became') ? 'bg-green-50 text-green-600' :
                      bill.latestAction?.text?.toLowerCase().includes('passed') ? 'bg-blue-50 text-blue-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {bill.latestAction?.text?.toLowerCase().includes('became') ? 'Enacted' :
                       bill.latestAction?.text?.toLowerCase().includes('passed') ? 'Passed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Term history */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <SectionHeader
            title="Term History"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          />
          <div className="space-y-3">
            {member.terms?.slice().reverse().map((term, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-revela-navy">{term.memberType}</p>
                  <p className="text-xs text-gray-400">{term.stateCode || member.state}</p>
                </div>
                <span className="text-sm text-gray-500">{term.startYear} — {term.endYear || 'Present'}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}

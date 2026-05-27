'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function formatMoney(amount) {
  if (!amount) return '$0'
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount.toFixed(0)}`
}

const PARTY_STYLES = {
  Republican: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
  Democrat: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
  Bipartisan: { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-400' },
}

export default function FollowTheMoney() {
  const [pacs, setPacs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPacs() {
      try {
        const res = await fetch('/api/top-pacs')
        const data = await res.json()
        setPacs(data.pacs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPacs()
  }, [])

  const maxSpent = pacs.length > 0 ? pacs[0].spent : 1

  return (
    <section className="py-20 px-6 bg-revela-navy">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-3">Follow the Money</p>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Who's really funding American politics?
          </h2>
          <p className="text-blue-200 max-w-2xl mx-auto text-base leading-relaxed">
            Super PACs spend hundreds of millions influencing elections — often across both parties.
            This money funds attack ads, voter outreach, and candidate support with no coordination limits.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/2 mb-3"/>
                <div className="h-2 bg-white/10 rounded w-full"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {pacs.map((pac, i) => {
              const style = PARTY_STYLES[pac.party] || PARTY_STYLES.Bipartisan
              const pct = maxSpent > 0 ? (pac.spent / maxSpent) * 100 : 0
              return (
                <div key={pac.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-300 text-sm font-medium w-5">#{i + 1}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{pac.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className={`w-2 h-2 rounded-full ${style.dot}`}/>
                          <span className="text-xs text-blue-300">{pac.party} · {pac.cycle} cycle</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold text-sm">{formatMoney(pac.spent)}</p>
                      <p className="text-xs text-blue-300">spent</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: pac.party === 'Republican' ? '#f87171' : pac.party === 'Democrat' ? '#60a5fa' : '#c084fc'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-lg">💡</div>
            <div>
              <p className="text-white font-medium text-sm mb-1">What is a Super PAC?</p>
              <p className="text-blue-200 text-sm leading-relaxed">
                Super PACs are independent expenditure committees that can raise unlimited money from corporations, unions, and individuals. They cannot legally coordinate with candidates but can spend unlimited amounts supporting or opposing them. Unlike direct campaign donations, Super PAC spending has no limits.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/congress"
            className="inline-block text-sm font-medium text-white border border-white/30 px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            See how PAC money affects your representatives →
          </Link>
        </div>
      </div>
    </section>
  )
}

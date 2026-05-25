'use client'
import { useState } from 'react'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
          <div style={{ width: '5px', height: '9px', background: '#93c5fd', borderRadius: '2px 2px 0 0' }} />
          <div style={{ width: '5px', height: '15px', background: '#2563eb', borderRadius: '2px 2px 0 0' }} />
          <div style={{ width: '5px', height: '22px', background: '#1d4ed8', borderRadius: '2px 2px 0 0' }} />
          <div style={{ width: '5px', height: '12px', background: '#bfdbfe', borderRadius: '2px 2px 0 0' }} />
          <div style={{ width: '5px', height: '7px', background: '#d1d5db', borderRadius: '2px 2px 0 0' }} />
          <div style={{ width: '5px', height: '18px', background: '#2563eb', borderRadius: '2px 2px 0 0' }} />
        </div>
        <div style={{ height: '1.5px', background: '#e5e7eb', borderRadius: '1px', marginTop: '3px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '8px', color: '#9ca3af' }}>Project</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, textTransform: 'uppercase', fontSize: '22px', color: 'inherit', lineHeight: 1 }}>REVELA<span style={{ color: '#2563eb' }}>.</span></span>
        <span style={{ fontSize: '7px', letterSpacing: '2px', textTransform: 'uppercase', color: '#9ca3af', marginTop: '2px' }}>Civic Technology</span>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet" />
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/"><Logo /></a>

        <div className="hidden md:flex items-center gap-8">
          <a href="/#how-it-works" className="text-sm text-gray-500 hover:text-revela-navy transition-colors">How it works</a>
          <a href="/#mission" className="text-sm text-gray-500 hover:text-revela-navy transition-colors">Mission</a>
          <a href="/congress" className="text-sm text-gray-500 hover:text-revela-navy transition-colors">Congress</a>
          <a href="#waitlist" className="text-sm font-medium bg-revela-blue text-white px-5 py-2 rounded-lg hover:bg-revela-blue-dark transition-colors">
            Join waitlist
          </a>
        </div>

        <button
          className="md:hidden p-2 text-gray-500 hover:text-revela-navy"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          <a href="/#how-it-works" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="/#mission" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Mission</a>
          <a href="/congress" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Congress</a>
          <a href="#waitlist" className="text-sm font-medium text-revela-blue" onClick={() => setMenuOpen(false)}>Join waitlist →</a>
        </div>
      )}
    </nav>
  )
}
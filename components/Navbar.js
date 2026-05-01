'use client'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display text-xl font-bold tracking-tight text-revela-navy">
          Project <span className="text-revela-blue">Revela</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-gray-500 hover:text-revela-navy transition-colors">How it works</a>
          <a href="#mission" className="text-sm text-gray-500 hover:text-revela-navy transition-colors">Mission</a>
          <a href="#waitlist" className="text-sm font-medium bg-revela-blue text-white px-5 py-2 rounded-lg hover:bg-revela-blue-dark transition-colors">
            Join waitlist
          </a>
        </div>

        {/* Mobile menu button */}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-4">
          <a href="#how-it-works" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#mission" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>Mission</a>
          <a href="#waitlist" className="text-sm font-medium text-revela-blue" onClick={() => setMenuOpen(false)}>Join waitlist →</a>
        </div>
      )}
    </nav>
  )
}

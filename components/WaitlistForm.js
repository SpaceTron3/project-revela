'use client'
import { useState } from 'react'

export default function WaitlistForm({ dark = false }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | success | error

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      return
    }
    // TODO: wire to your email service (Mailchimp, ConvertKit, etc.)
    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium ${
        dark ? 'bg-green-900/40 text-green-300' : 'bg-green-50 text-green-700'
      }`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        You're on the list! We'll be in touch before launch.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setStatus('idle') }}
          placeholder="your@email.com"
          className={`w-full px-4 py-3 rounded-lg text-sm border outline-none transition-colors ${
            status === 'error'
              ? 'border-red-400 focus:border-red-500'
              : dark
                ? 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/50'
                : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:border-revela-blue'
          }`}
        />
        {status === 'error' && (
          <p className="text-xs text-red-400 mt-1">Please enter a valid email address.</p>
        )}
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-revela-blue hover:bg-revela-blue-dark text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
      >
        Notify me
      </button>
    </form>
  )
}

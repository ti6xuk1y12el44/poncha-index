'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/admin'
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <a href="/" className="text-stone-500 text-sm hover:text-amber-400">
            ← Back to home
          </a>
        <h1 className="text-3xl font-bold text-center">Admin login</h1>
        <div className="mt-8 space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="w-full bg-amber-500 text-stone-900 py-3 rounded-full font-semibold hover:bg-amber-400 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </div>
      <div>
      </div>
    </main>
  )
}
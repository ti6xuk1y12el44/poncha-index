'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

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
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">
      <Navbar solid={true} />

      <section className="px-6 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-black mt-3">Admin login</h1>
            <p className="text-emerald-800/60 text-sm mt-1">Sign in to review submissions.</p>
          </div>

          <div className="mt-6 space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#fdfbf3] border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#fdfbf3] border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" />
            {error && <p className="text-rose-600 text-sm">{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full bg-amber-400 text-emerald-950 py-3 rounded-full font-bold hover:bg-amber-300 transition disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
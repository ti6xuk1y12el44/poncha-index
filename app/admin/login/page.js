'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')

    if (username.trim().toLowerCase() !== process.env.NEXT_PUBLIC_ADMIN_USERNAME) {
      setError('Invalid username or password.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      password,
    })
    setLoading(false)
    if (error) {
      setError('Invalid username or password.')
    } else {
      window.location.href = '/admin'
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-black text-lg">PONCHA<span className="text-[#c9a84c]">.</span>INDEX</p>
          <p className="text-white/30 text-sm mt-2">Admin access</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">Username</label>
              <input type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-2">Password</label>
              <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
            </div>
            {error && <p className="text-rose-400 text-sm">{error}</p>}
            <button onClick={handleLogin} disabled={loading} className="w-full bg-[#c9a84c] text-[#0a0f0a] py-3 rounded-full font-bold hover:bg-[#d4b65c] transition disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
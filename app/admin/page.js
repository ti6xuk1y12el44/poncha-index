'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  async function loadSubmissions() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/pending', {
      headers: { 'Authorization': 'Bearer ' + session.access_token },
    })
    if (res.ok) {
      const json = await res.json()
      setSubmissions(json.submissions || [])
    } else {
      setSubmissions([])
    }
    setLoading(false)
  }

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/admin/login'
      } else {
        setAuthChecked(true)
        loadSubmissions()
      }
    }
    checkAuth()
  }, [])

  async function approve(sub) {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.access_token,
      },
      body: JSON.stringify(sub),
    })
    if (!res.ok) {
      const err = await res.json()
      alert('Error: ' + err.error)
      return
    }
    loadSubmissions()
  }

  async function reject(sub) {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.access_token,
      },
      body: JSON.stringify(sub),
    })
    if (!res.ok) {
      const err = await res.json()
      alert('Error: ' + err.error)
      return
    }
    loadSubmissions()
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center">
        <p className="text-white/30">Checking access...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-4xl mx-auto pt-32 pb-20">
        <div className="flex justify-between items-center">
          <a href="/" className="text-white/30 text-sm hover:text-white transition">← Back to home</a>
          <button onClick={logout} className="text-white/30 text-sm hover:text-white transition">Sign out</button>
        </div>

        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium mt-8">Admin</p>
        <h1 className="text-4xl font-black mt-2">Pending submissions</h1>
        <p className="text-white/40 mt-2">Review and approve community price submissions.</p>

        {loading ? (
          <p className="text-white/30 mt-10">Loading...</p>
        ) : submissions.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-10 text-center text-white/30 mt-10">
            No pending submissions. All clear.
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">{sub.venues?.name}</h3>
                  <p className="text-white/50 text-sm mt-1">
                    {sub.poncha_types?.name} · <span className="text-[#c9a84c] font-bold">€{sub.price_eur}</span>
                  </p>
                  <p className="text-white/20 text-xs mt-1">
                    By {sub.contributor_name} · observed {sub.observed_at}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => approve(sub)} className="bg-[#c9a84c] text-[#0a0f0a] px-6 py-2.5 rounded-full font-semibold hover:bg-[#d4b65c] transition">
                    Approve
                  </button>
                  <button onClick={() => reject(sub)} className="bg-white/5 text-white/50 px-6 py-2.5 rounded-full font-semibold hover:bg-white/10 hover:text-white transition">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
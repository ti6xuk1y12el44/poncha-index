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

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  async function exportVenues() {
    const { data } = await supabase.from('venues').select('*').order('name')
    if (!data || data.length === 0) return alert('No venues to export.')
    const headers = ['name', 'slug', 'address', 'municipality', 'latitude', 'longitude', 'phone', 'website', 'status']
    const rows = data.map(v => headers.map(h => '"' + (v[h] || '').toString().replace(/"/g, '""') + '"').join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    downloadCSV(csv, 'poncha-venues.csv')
  }

  async function exportPrices() {
    const { data } = await supabase
      .from('price_submissions')
      .select('*, venues(name), poncha_types(name)')
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
    if (!data || data.length === 0) return alert('No prices to export.')
    const rows = data.map(p => [
      '"' + (p.venues?.name || '') + '"',
      '"' + (p.poncha_types?.name || '') + '"',
      p.price_eur,
      '"' + (p.observed_at || '') + '"',
      '"' + (p.contributor_name || '') + '"',
      '"' + (p.source_type || '') + '"',
      '"' + (p.moderation_status || '') + '"',
    ].join(','))
    const csv = ['venue,poncha_type,price_eur,observed_at,contributor,source_type,status', ...rows].join('\n')
    downloadCSV(csv, 'poncha-prices.csv')
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

        <div className="flex flex-wrap gap-3 mt-4">
          <a href="/admin/venues" className="border border-white/10 text-white/50 px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/5 hover:text-white transition">
            Manage venues →
          </a>
          <button onClick={exportVenues} className="border border-white/10 text-white/50 px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/5 hover:text-white transition">
            Export venues CSV
          </button>
          <button onClick={exportPrices} className="border border-white/10 text-white/50 px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/5 hover:text-white transition">
            Export prices CSV
          </button>
        </div>

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
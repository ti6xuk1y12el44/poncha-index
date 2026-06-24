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
    const { data } = await supabase
      .from('price_submissions')
      .select('*, venues(name), poncha_types(name)')
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: false })
    setSubmissions(data || [])
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
    await supabase
      .from('price_submissions')
      .update({ moderation_status: 'approved' })
      .eq('id', sub.id)

    await supabase
      .from('price_current')
      .upsert({
        venue_id: sub.venue_id,
        poncha_type_id: sub.poncha_type_id,
        submission_id: sub.id,
        price_eur: sub.price_eur,
        verified_at: new Date().toISOString(),
      })

    loadSubmissions()
  }

  async function reject(sub) {
    await supabase
      .from('price_submissions')
      .update({ moderation_status: 'rejected' })
      .eq('id', sub.id)
    loadSubmissions()
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-[#fdfbf3] text-emerald-950 flex items-center justify-center">
        <p className="text-emerald-800/50">Checking access...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-4xl mx-auto pt-32 pb-20">
        <div className="flex justify-between items-center">
          <a href="/" className="text-emerald-700 text-sm font-semibold hover:text-emerald-900">← Back to home</a>
          <button onClick={logout} className="text-emerald-700 text-sm font-semibold hover:text-emerald-900">Sign out</button>
        </div>

        <h1 className="text-4xl font-black mt-4">Pending submissions</h1>
        <p className="text-emerald-800/70 mt-2">Review and approve community price submissions.</p>

        {loading ? (
          <p className="text-emerald-800/50 mt-10">Loading...</p>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-emerald-800/50 mt-10 border border-emerald-100">
            No pending submissions.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-emerald-950">{sub.venues?.name}</h3>
                  <p className="text-emerald-800/70 text-sm">
                    {sub.poncha_types?.name} · <span className="text-emerald-700 font-bold">€{sub.price_eur}</span>
                  </p>
                  <p className="text-emerald-800/40 text-xs mt-1">
                    By {sub.contributor_name} · observed {sub.observed_at}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(sub)} className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-full font-semibold transition">
                    Approve
                  </button>
                  <button onClick={() => reject(sub)} className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-5 py-2 rounded-full font-semibold transition">
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
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
      <main className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
        <p className="text-stone-500">Checking access...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <a href="/" className="text-stone-500 text-sm hover:text-amber-400">← Back to home</a>
          <button onClick={logout} className="text-stone-500 text-sm hover:text-amber-400">Sign out</button>
        </div>

        <h1 className="text-4xl font-bold mt-4">Admin — pending submissions</h1>
        <p className="text-stone-400 mt-2">Review and approve community price submissions.</p>

        {loading ? (
          <p className="text-stone-500 mt-10">Loading...</p>
        ) : submissions.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center text-stone-500 mt-10">
            No pending submissions. All caught up!
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{sub.venues?.name}</h3>
                  <p className="text-stone-400 text-sm">
                    {sub.poncha_types?.name} · <span className="text-amber-400 font-semibold">€{sub.price_eur}</span>
                  </p>
                  <p className="text-stone-500 text-xs mt-1">
                    By {sub.contributor_name} · observed {sub.observed_at}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(sub)} className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full font-semibold">
                    Approve
                  </button>
                  <button onClick={() => reject(sub)} className="bg-stone-700 hover:bg-stone-600 text-white px-5 py-2 rounded-full font-semibold">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
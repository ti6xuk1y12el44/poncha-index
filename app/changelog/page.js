'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PAGE_SIZE = 5

export default function ChangelogPage() {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  async function loadUpdates(from = 0, append = false) {
    if (append) setLoadingMore(true)
    else setLoading(true)

    const { data } = await supabase
      .from('price_submissions')
      .select('*, venues(name, slug), poncha_types(name)')
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (data) {
      setUpdates(prev => append ? [...prev, ...data] : data)
      setHasMore(data.length === PAGE_SIZE)
    } else {
      setHasMore(false)
    }

    setLoading(false)
    setLoadingMore(false)
  }

  useEffect(() => {
    loadUpdates()
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-3xl mx-auto pt-32 pb-20">

        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Transparency</p>
        <h1 className="text-4xl md:text-5xl font-black mt-2">Updates</h1>
        <p className="text-white/40 mt-2">Every approved price update, newest first.</p>

        {loading ? (
          <p className="text-white/30 mt-10">Loading updates...</p>
        ) : updates.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-10 text-center text-white/30 mt-10">
            No approved updates yet.
          </div>
        ) : (
          <>
            <div className="mt-10 space-y-3">
              {updates.map(u => (
                <a key={u.id} href={'/venues/' + (u.venues?.slug || '')} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-2xl px-6 py-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition">
                  <div>
                    <p className="font-semibold">{u.venues?.name || 'Unknown venue'}</p>
                    <p className="text-white/30 text-sm mt-1">
                      {u.poncha_types?.name || 'Poncha'} · {u.observed_at} · {u.contributor_name || 'Anonymous'}
                    </p>
                  </div>
                  <p className="text-[#c9a84c] font-black text-xl shrink-0 ml-4">€{u.price_eur}</p>
                </a>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => loadUpdates(updates.length, true)}
                  disabled={loadingMore}
                  className="border border-white/10 text-white/50 px-8 py-3 rounded-full font-semibold hover:bg-white/5 hover:text-white transition disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}

      </section>
      <Footer />
    </main>
  )
}
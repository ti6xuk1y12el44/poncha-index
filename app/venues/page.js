'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function VenuesPage() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [municipality, setMunicipality] = useState('All')

  useEffect(() => {
    async function load() {
      const { data: v } = await supabase
        .from('venues')
        .select('*')
        .eq('status', 'active')
        .order('name')

      const { data: prices } = await supabase
        .from('price_current')
        .select('venue_id, price_eur')

      const priceByVenue = {}
      for (const p of prices || []) {
        if (priceByVenue[p.venue_id] == null || p.price_eur < priceByVenue[p.venue_id]) {
          priceByVenue[p.venue_id] = p.price_eur
        }
      }

      const withPrice = (v || []).map(venue => ({
        ...venue,
        price: priceByVenue[venue.id] ?? null,
      }))

      setVenues(withPrice)
      setLoading(false)
    }
    load()
  }, [])

  const municipalities = ['All', ...Array.from(new Set(venues.map(v => v.municipality).filter(Boolean))).sort()]

  const filtered = venues.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase())
    const matchMuni = municipality === 'All' || v.municipality === municipality
    return matchSearch && matchMuni
  })

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-6xl mx-auto pt-32 pb-20">

        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Browse</p>
        <h1 className="text-4xl md:text-5xl font-black mt-2">All venues</h1>
        <p className="text-white/40 mt-2">Every spot serving poncha across Madeira.</p>

        <input
          type="text"
          placeholder="Search by venue name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mt-8 w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-lg text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20"
        />

        <div className="flex gap-2 mt-4 flex-wrap">
          {municipalities.map(m => (
            <button
              key={m}
              onClick={() => setMunicipality(m)}
              className={
                'px-4 py-2 rounded-full font-medium text-sm transition ' +
                (municipality === m
                  ? 'bg-[#c9a84c] text-[#0a0f0a]'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10')
              }
            >
              {m}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white/30 mt-10">Loading venues...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 mt-10">No venues match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {filtered.map(v => (
              <a key={v.id} href={'/venues/' + v.slug} className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#c9a84c] transition">{v.name}</h3>
                    <p className="text-white/30 text-sm mt-1">{v.municipality}</p>
                  </div>
                  {v.price != null && (
                    <p className="text-xl font-black text-[#c9a84c]">€{v.price.toFixed(2)}</p>
                  )}
                </div>
                <div className="mt-6 flex items-center gap-2 text-white/20 text-sm group-hover:text-white/40 transition">
                  <span>View details</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        )}

      </section>
      <Footer />
    </main>
  )
}
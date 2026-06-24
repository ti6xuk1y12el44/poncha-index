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
      const { data } = await supabase
        .from('venues')
        .select('*')
        .eq('status', 'active')
        .order('name')
      setVenues(data || [])
      setLoading(false)
    }
    load()
  }, [])

  // Lista de municipios para o filtro
  const municipalities = ['All', ...Array.from(new Set(venues.map(v => v.municipality).filter(Boolean)))]

  const filtered = venues.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase())
    const matchMuni = municipality === 'All' || v.municipality === municipality
    return matchSearch && matchMuni
  })

  return (
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-6xl mx-auto pt-32 pb-20">

        <h1 className="text-4xl md:text-5xl font-black">All venues</h1>
        <p className="text-emerald-800/70 mt-2">Every spot serving poncha across Madeira.</p>

        <input
          type="text"
          placeholder="Search by venue name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mt-8 w-full bg-white border border-emerald-200 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-emerald-500"
        />

        <div className="flex gap-2 mt-4 flex-wrap">
          {municipalities.map(m => (
            <button
              key={m}
              onClick={() => setMunicipality(m)}
              className={
                'px-4 py-2 rounded-full font-medium text-sm transition ' +
                (municipality === m ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50')
              }
            >
              {m}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-emerald-800/50 mt-10">Loading venues...</p>
        ) : filtered.length === 0 ? (
          <p className="text-emerald-800/50 mt-10">No venues match your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {filtered.map(v => (
              <a key={v.id} href={'/venues/' + v.slug} className="group bg-white rounded-3xl p-6 border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">🍹</div>
                <h3 className="font-bold text-lg mt-4 text-emerald-950 group-hover:text-emerald-700 transition">{v.name}</h3>
                <p className="text-emerald-800/60 text-sm mt-1">📍 {v.municipality}</p>
                <p className="mt-4 text-amber-600 font-semibold text-sm">View details →</p>
              </a>
            ))}
          </div>
        )}

      </section>
      <Footer />
    </main>
  )
}
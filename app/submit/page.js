'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function SubmitPage() {
  const [venues, setVenues] = useState([])
  const [ponchaTypes, setPonchaTypes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    venue_id: '',
    poncha_type_id: '',
    price_eur: '',
    observed_at: '',
    contributor_name: '',
    confirmed: false,
  })

  useEffect(() => {
    async function loadData() {
      const { data: v } = await supabase.from('venues').select('id, name').eq('status', 'active').order('name')
      const { data: p } = await supabase.from('poncha_types').select('id, name').eq('active', true)
      setVenues(v || [])
      setPonchaTypes(p || [])
    }
    loadData()
  }, [])

  function updateField(field, value) {
    setForm({ ...form, [field]: value })
  }

  async function handleSubmit() {
    if (!form.venue_id || !form.poncha_type_id || !form.price_eur || !form.observed_at) {
      alert('Please fill in all required fields.')
      return
    }
    if (!form.confirmed) {
      alert('Please confirm the submission is accurate.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('price_submissions').insert({
      venue_id: form.venue_id,
      poncha_type_id: form.poncha_type_id,
      price_eur: parseFloat(form.price_eur),
      observed_at: form.observed_at,
      source_type: 'community',
      contributor_name: form.contributor_name || 'Anonymous',
      moderation_status: 'pending',
    })
    setLoading(false)

    if (error) {
      alert('Something went wrong: ' + error.message)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-[#c9a84c] text-6xl font-black">Done</p>
          <p className="text-white/40 mt-4">
            Your price has been submitted and is awaiting review. Once approved it will appear on the index.
          </p>
          <a href="/" className="inline-block mt-8 border border-[#c9a84c] text-[#c9a84c] px-8 py-3 rounded-full font-semibold hover:bg-[#c9a84c] hover:text-[#0a0f0a] transition">
            Back to home
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-xl mx-auto pt-32 pb-20">
        <a href="/" className="text-white/30 text-sm hover:text-white transition">← Back</a>

        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium mt-8">Contribute</p>
        <h1 className="text-3xl md:text-4xl font-black mt-2">Add a poncha price</h1>
        <p className="text-white/40 mt-2">
          All submissions are reviewed before going live on the index.
        </p>

        <div className="mt-10 space-y-5">

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">Venue</label>
            <select value={form.venue_id} onChange={e => updateField('venue_id', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50">
              <option value="" className="bg-[#141e16] text-white">Select a venue...</option>
              {venues.map(v => (
                <option key={v.id} value={v.id} className="bg-[#141e16] text-white">{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">Poncha type</label>
            <select value={form.poncha_type_id} onChange={e => updateField('poncha_type_id', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50">
              <option value="" className="bg-[#141e16] text-white">Select a type...</option>
              {ponchaTypes.map(p => (
                <option key={p.id} value={p.id} className="bg-[#141e16] text-white">{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">Price (€)</label>
            <input type="number" step="0.10" placeholder="e.g. 2.50" value={form.price_eur} onChange={e => updateField('price_eur', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">Date observed</label>
            <input type="date" value={form.observed_at} onChange={e => updateField('observed_at', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50" />
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider font-medium mb-2">Your name (optional)</label>
            <input type="text" placeholder="Anonymous" value={form.contributor_name} onChange={e => updateField('contributor_name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
          </div>

          <label className="flex items-start gap-3 text-sm text-white/50 cursor-pointer">
            <input type="checkbox" checked={form.confirmed} onChange={e => updateField('confirmed', e.target.checked)} className="mt-1 accent-[#c9a84c]" />
            <span>I confirm this price is accurate and observed by me at the venue.</span>
          </label>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-[#c9a84c] text-[#0a0f0a] py-4 rounded-full font-bold hover:bg-[#d4b65c] transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit price'}
          </button>

        </div>
      </section>

      <Footer />
    </main>
  )
}
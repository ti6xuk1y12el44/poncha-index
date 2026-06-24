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
      <main className="min-h-screen bg-[#fdfbf3] text-emerald-950 flex items-center justify-center px-6">
        <div className="text-center max-w-md bg-white rounded-3xl p-10 border border-emerald-100 shadow-sm">
          <div className="text-5xl">🍹</div>
          <h1 className="text-3xl font-black text-emerald-800 mt-4">Thank you!</h1>
          <p className="text-emerald-800/70 mt-3">
            Your price has been submitted and is awaiting review. Once approved it will appear on the index.
          </p>
          <a href="/" className="inline-block mt-8 bg-amber-400 text-emerald-950 px-8 py-3 rounded-full font-bold hover:bg-amber-300 transition">
            Back to home
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-xl mx-auto pt-32 pb-20">
        <a href="/" className="text-emerald-700 text-sm font-semibold hover:text-emerald-900">← Back to home</a>

        <h1 className="text-4xl font-black mt-4">Add a poncha price</h1>
        <p className="text-emerald-800/70 mt-2">
          Help keep the index alive. All submissions are reviewed before going live.
        </p>

        <div className="mt-8 space-y-5 bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm">

          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">Venue *</label>
            <select value={form.venue_id} onChange={e => updateField('venue_id', e.target.value)} className="w-full bg-[#fdfbf3] border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500">
              <option value="">Select a venue...</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">Poncha type *</label>
            <select value={form.poncha_type_id} onChange={e => updateField('poncha_type_id', e.target.value)} className="w-full bg-[#fdfbf3] border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500">
              <option value="">Select a type...</option>
              {ponchaTypes.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">Price in euros *</label>
            <input type="number" step="0.10" placeholder="e.g. 2.50" value={form.price_eur} onChange={e => updateField('price_eur', e.target.value)} className="w-full bg-[#fdfbf3] border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">Date observed *</label>
            <input type="date" value={form.observed_at} onChange={e => updateField('observed_at', e.target.value)} className="w-full bg-[#fdfbf3] border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-800 mb-2">Your name or nickname</label>
            <input type="text" placeholder="Anonymous" value={form.contributor_name} onChange={e => updateField('contributor_name', e.target.value)} className="w-full bg-[#fdfbf3] border border-emerald-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" />
          </div>

          <label className="flex items-start gap-3 text-sm text-emerald-800/80">
            <input type="checkbox" checked={form.confirmed} onChange={e => updateField('confirmed', e.target.checked)} className="mt-1" />
            <span>I confirm this price is accurate and observed by me at the venue.</span>
          </label>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-amber-400 text-emerald-950 py-4 rounded-full font-bold hover:bg-amber-300 transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit price'}
          </button>

        </div>
      </section>
      <Footer />
    </main>
  )
}
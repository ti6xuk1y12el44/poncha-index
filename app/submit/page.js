'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
      <main className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-amber-400">Thank you!</h1>
          <p className="text-stone-400 mt-4">
            Your price has been submitted and is awaiting review. Once approved it will appear on the index.
          </p>
          <a href="/" className="text-stone-500 text-sm hover:text-amber-400">
            ← Back to home
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 px-6 py-12">
      <div className="max-w-xl mx-auto">
        <a href="/" className="text-stone-500 text-sm hover:text-amber-400">← Back to home</a>

        <h1 className="text-4xl font-bold mt-4">Add a poncha price</h1>
        <p className="text-stone-400 mt-2">
          Help keep the index alive. All submissions are reviewed before going live.
        </p>

        <div className="mt-8 space-y-5">

          <div>
            <label className="block text-sm text-stone-400 mb-2">Venue *</label>
            <select value={form.venue_id} onChange={e => updateField('venue_id', e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3">
              <option value="">Select a venue...</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Poncha type *</label>
            <select value={form.poncha_type_id} onChange={e => updateField('poncha_type_id', e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3">
              <option value="">Select a type...</option>
              {ponchaTypes.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Price in euros *</label>
            <input type="number" step="0.10" placeholder="e.g. 2.50" value={form.price_eur} onChange={e => updateField('price_eur', e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3" />
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Date observed *</label>
            <input type="date" value={form.observed_at} onChange={e => updateField('observed_at', e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3" />
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-2">Your name or nickname</label>
            <input type="text" placeholder="Anonymous" value={form.contributor_name} onChange={e => updateField('contributor_name', e.target.value)} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3" />
          </div>

          <label className="flex items-start gap-3 text-sm text-stone-400">
            <input type="checkbox" checked={form.confirmed} onChange={e => updateField('confirmed', e.target.checked)} className="mt-1" />
            <span>I confirm this price is accurate and observed by me at the venue.</span>
          </label>

          <button onClick={handleSubmit} disabled={loading} className="w-full bg-amber-500 text-stone-900 py-4 rounded-full font-semibold hover:bg-amber-400 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit price'}
          </button>

        </div>
      </div>
    </main>
  )
}
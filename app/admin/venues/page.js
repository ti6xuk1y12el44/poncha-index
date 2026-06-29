'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const emptyForm = { name: '', slug: '', address: '', municipality: '', latitude: '', longitude: '', phone: '', website: '' }
  const [form, setForm] = useState(emptyForm)

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  async function loadVenues() {
    setLoading(true)
    const { data } = await supabase
      .from('venues')
      .select('*')
      .order('name')
    setVenues(data || [])
    setLoading(false)
  }

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/admin/login'
      } else {
        setAuthChecked(true)
        loadVenues()
      }
    }
    checkAuth()
  }, [])

  function generateSlug(name) {
    return name.toLowerCase()
      .replace(/[áàãâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòõôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function handleNameChange(val) {
    setForm({ ...form, name: val, slug: editing ? form.slug : generateSlug(val) })
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(venue) {
    setEditing(venue)
    setForm({
      name: venue.name || '',
      slug: venue.slug || '',
      address: venue.address || '',
      municipality: venue.municipality || '',
      latitude: venue.latitude || '',
      longitude: venue.longitude || '',
      phone: venue.phone || '',
      website: venue.website || '',
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      alert('Name and slug are required.')
      return
    }

    setSaving(true)
    const token = await getToken()

    const payload = {
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    }

    if (editing) {
      payload.id = editing.id
      payload.status = editing.status
    }

    const res = await fetch('/api/manage-venues', {
      method: editing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (!res.ok) {
      const err = await res.json()
      alert('Error: ' + err.error)
      return
    }

    closeForm()
    loadVenues()
  }

  async function toggleArchive(venue) {
    const token = await getToken()
    const newStatus = venue.status === 'active' ? 'archived' : 'active'

    await fetch('/api/manage-venues', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ ...venue, status: newStatus }),
    })

    loadVenues()
  }

  const filtered = venues.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.municipality || '').toLowerCase().includes(search.toLowerCase())
  )

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

      <section className="px-6 md:px-12 max-w-5xl mx-auto pt-32 pb-20">
        <div className="flex justify-between items-center">
          <a href="/admin" className="text-white/30 text-sm hover:text-white transition">← Back to admin</a>
        </div>

        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium mt-8">Admin</p>
        <h1 className="text-4xl font-black mt-2">Manage venues</h1>
        <p className="text-white/40 mt-2">Create, edit and archive venues.</p>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <input
            type="text"
            placeholder="Search venues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20"
          />
          <button onClick={openCreate} className="bg-[#c9a84c] text-[#0a0f0a] px-6 py-3 rounded-full font-bold hover:bg-[#d4b65c] transition whitespace-nowrap">
            + New venue
          </button>
        </div>

        {showForm && (
          <div className="mt-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">{editing ? 'Edit venue' : 'Create new venue'}</h2>
              <button onClick={closeForm} className="text-white/30 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" placeholder="e.g. Taberna da Poncha" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Slug *</label>
                <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" placeholder="taberna-da-poncha" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Address</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Municipality</label>
                <input type="text" value={form.municipality} onChange={e => setForm({ ...form, municipality: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Latitude</label>
                <input type="text" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" placeholder="e.g. 32.6478" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Longitude</label>
                <input type="text" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" placeholder="e.g. -16.9081" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider font-medium mb-1">Website</label>
                <input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20" />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="mt-6 bg-[#c9a84c] text-[#0a0f0a] px-8 py-3 rounded-full font-bold hover:bg-[#d4b65c] transition disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Save changes' : 'Create venue'}
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-white/30 mt-10">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 mt-10">No venues found.</p>
        ) : (
          <div className="mt-8 space-y-3">
            {filtered.map(v => (
              <div key={v.id} className={'rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3 ' + (v.status === 'archived' ? 'bg-white/[0.02] border border-white/[0.04] opacity-50' : 'bg-white/[0.03] border border-white/[0.06]')}>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{v.name}</h3>
                    {v.status === 'archived' && (
                      <span className="text-xs bg-white/10 text-white/40 px-2 py-0.5 rounded-full">Archived</span>
                    )}
                  </div>
                  <p className="text-white/30 text-sm mt-1">{v.municipality} · /{v.slug}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(v)} className="border border-white/10 text-white/50 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/5 hover:text-white transition">
                    Edit
                  </button>
                  <button onClick={() => toggleArchive(v)} className={'px-4 py-2 rounded-full text-sm font-semibold transition ' + (v.status === 'archived' ? 'border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10' : 'border border-rose-500/30 text-rose-400 hover:bg-rose-500/10')}>
                    {v.status === 'archived' ? 'Restore' : 'Archive'}
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
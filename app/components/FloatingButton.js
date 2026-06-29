'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FloatingButton() {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [venues, setVenues] = useState([])
  const [photoForm, setPhotoForm] = useState({ venue_id: '', description: '', contributor_name: '' })

  useEffect(() => {
    async function loadVenues() {
      const { data } = await supabase.from('venues').select('id, name').eq('status', 'active').order('name')
      setVenues(data || [])
    }
    loadVenues()
  }, [])

  function reset() {
    setSent(false)
    setPanel(null)
    setMessage('')
    setPhotoForm({ venue_id: '', description: '', contributor_name: '' })
  }

  function closeAll() {
    setOpen(false)
    reset()
  }

  async function sendCorrection() {
    if (!message.trim()) return
    setSending(true)
    await supabase.from('corrections').insert({
      message: message.trim(),
      page_url: window.location.href,
    })
    setSending(false)
    setSent(true)
    setTimeout(closeAll, 2000)
  }

  async function sendPhoto() {
    if (!photoForm.venue_id || !photoForm.description.trim()) return
    setSending(true)
    await supabase.from('photo_submissions').insert({
      venue_id: photoForm.venue_id,
      description: photoForm.description.trim(),
      contributor_name: photoForm.contributor_name.trim() || 'Anonymous',
    })
    setSending(false)
    setSent(true)
    setTimeout(closeAll, 2000)
  }

  const actions = [
    { id: 'price', label: 'Add a price', href: '/submit' },
    { id: 'photo', label: 'Share a photo', action: () => setPanel('photo') },
    { id: 'correction', label: 'Suggest correction', action: () => setPanel('correction') },
    { id: 'mf', label: 'Madeira Friends', href: 'https://madeirafriends.org', external: true },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

      {panel === 'correction' && (
        <div className="bg-[#141e16] border border-white/10 rounded-2xl shadow-2xl p-5 w-80">
          {sent ? (
            <div className="text-center py-6">
              <p className="text-[#c9a84c] text-2xl font-black">Thank you</p>
              <p className="text-white/40 text-sm mt-2">Your suggestion has been recorded.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Suggest a correction</h3>
                <button onClick={reset} className="text-white/30 hover:text-white text-sm">✕</button>
              </div>
              <p className="text-white/40 text-xs mb-3">Wrong price, closed venue, wrong address — let us know.</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe what needs correcting..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20"
              />
              <button
                onClick={sendCorrection}
                disabled={sending || !message.trim()}
                className="w-full mt-3 bg-[#c9a84c] text-[#0a0f0a] py-2.5 rounded-full font-semibold text-sm hover:bg-[#d4b65c] transition disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </>
          )}
        </div>
      )}

      {panel === 'photo' && (
        <div className="bg-[#141e16] border border-white/10 rounded-2xl shadow-2xl p-5 w-80">
          {sent ? (
            <div className="text-center py-6">
              <p className="text-[#c9a84c] text-2xl font-black">Thank you</p>
              <p className="text-white/40 text-sm mt-2">Your photo tip has been recorded.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Share a photo</h3>
                <button onClick={reset} className="text-white/30 hover:text-white text-sm">✕</button>
              </div>
              <p className="text-white/40 text-xs mb-3">Visited a venue? Tell us about it and share your experience.</p>
              <select
                value={photoForm.venue_id}
                onChange={e => setPhotoForm({ ...photoForm, venue_id: e.target.value })}
                className="w-full bg-[#141e16] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50 mb-3"
              >
                <option value="" className="bg-[#141e16] text-white">Select a venue...</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id} className="bg-[#141e16] text-white">{v.name}</option>
                ))}
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <textarea
                value={photoForm.description}
                onChange={e => setPhotoForm({ ...photoForm, description: e.target.value })}
                placeholder="Describe your visit or photo..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20"
              />
              <input
                type="text"
                value={photoForm.contributor_name}
                onChange={e => setPhotoForm({ ...photoForm, contributor_name: e.target.value })}
                placeholder="Your name (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white mt-3 focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20"
              />
              <button
                onClick={sendPhoto}
                disabled={sending || !photoForm.venue_id || !photoForm.description.trim()}
                className="w-full mt-3 bg-[#c9a84c] text-[#0a0f0a] py-2.5 rounded-full font-semibold text-sm hover:bg-[#d4b65c] transition disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </>
          )}
        </div>
      )}

      {open && !panel && (
        <div className="bg-[#141e16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-56">
          {actions.map(action => (
            action.href ? (
              <a
                key={action.id}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                className="flex items-center px-5 py-3.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition border-b border-white/5 last:border-0"
              >
                {action.label}
              </a>
            ) : (
              <button
                key={action.id}
                onClick={action.action}
                className="flex items-center px-5 py-3.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition w-full text-left border-b border-white/5 last:border-0"
              >
                {action.label}
              </button>
            )
          ))}
        </div>
      )}

      <button
        onClick={() => { if (panel) reset(); else setOpen(!open); }}
        className={
          'w-14 h-14 rounded-full font-bold shadow-lg transition-all flex items-center justify-center text-xl ' +
          (open || panel
            ? 'bg-white/10 text-white/60 hover:bg-white/20 rotate-45'
            : 'bg-[#c9a84c] text-[#0a0f0a] hover:bg-[#d4b65c]')
        }
      >
        +
      </button>

    </div>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function FloatingButton() {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [venues, setVenues] = useState([])
  const [photoForm, setPhotoForm] = useState({ venue_id: '', description: '', contributor_name: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileRef = useRef(null)

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
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  function closeAll() {
    setOpen(false)
    reset()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB.')
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
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
    if (!photoForm.venue_id || !photoFile) return
    setSending(true)

    const ext = photoFile.name.split('.').pop()
    const fileName = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, photoFile)

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      setSending(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName)

    await supabase.from('photo_submissions').insert({
      venue_id: photoForm.venue_id,
      photo_url: urlData.publicUrl,
      description: photoForm.description.trim() || null,
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
              <p className="text-white/40 text-sm mt-2">Your photo has been submitted.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">Share a photo</h3>
                <button onClick={reset} className="text-white/30 hover:text-white text-sm">✕</button>
              </div>

              <select
                value={photoForm.venue_id}
                onChange={e => setPhotoForm({ ...photoForm, venue_id: e.target.value })}
                className="w-full bg-[#141e16] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50 mb-3"
              >
                <option value="" className="bg-[#141e16] text-white">Select a venue...</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id} className="bg-[#141e16] text-white">{v.name}</option>
                ))}
              </select>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {photoPreview ? (
                <div className="relative mb-3">
                  <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                  <button
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                    className="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-black/80"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border border-dashed border-white/20 rounded-xl py-6 text-center text-white/30 text-sm hover:border-[#c9a84c]/40 hover:text-white/50 transition mb-3"
                >
                  Tap to select a photo
                </button>
              )}

              <textarea
                value={photoForm.description}
                onChange={e => setPhotoForm({ ...photoForm, description: e.target.value })}
                placeholder="Add a note (optional)"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20 mb-3"
              />

              <input
                type="text"
                value={photoForm.contributor_name}
                onChange={e => setPhotoForm({ ...photoForm, contributor_name: e.target.value })}
                placeholder="Your name (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a84c]/50 placeholder-white/20"
              />

              <button
                onClick={sendPhoto}
                disabled={sending || !photoForm.venue_id || !photoFile}
                className="w-full mt-3 bg-[#c9a84c] text-[#0a0f0a] py-2.5 rounded-full font-semibold text-sm hover:bg-[#d4b65c] transition disabled:opacity-50"
              >
                {sending ? 'Uploading...' : 'Send photo'}
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
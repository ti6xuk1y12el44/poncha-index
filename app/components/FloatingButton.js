'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FloatingButton() {
  const [open, setOpen] = useState(false)
  const [showCorrection, setShowCorrection] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSend() {
    if (!message.trim()) return
    setSending(true)

    await supabase.from('corrections').insert({
      message: message.trim(),
      page_url: window.location.href,
    })

    setSending(false)
    setSent(true)
    setMessage('')

    setTimeout(() => {
      setSent(false)
      setShowCorrection(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">

      {showCorrection && (
        <div className="bg-white border border-emerald-100 rounded-3xl shadow-2xl p-5 w-80 mb-2">
          {sent ? (
            <div className="text-center py-4">
              <p className="font-bold text-emerald-950 mt-2">Thank you!</p>
              <p className="text-emerald-800/60 text-sm mt-1">Your suggestion has been sent.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-emerald-950">Suggest a correction</h3>
                <button onClick={() => setShowCorrection(false)} className="text-emerald-800/40 hover:text-emerald-900 text-lg">✕</button>
              </div>
              <p className="text-emerald-800/60 text-sm mb-3">Spotted wrong info? Wrong price, closed venue, wrong address — let us know.</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe what needs correcting..."
                rows={3}
                className="w-full bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-950 resize-none focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="w-full mt-3 bg-emerald-800 text-white py-2.5 rounded-full font-semibold text-sm hover:bg-emerald-900 transition disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send suggestion'}
              </button>
            </>
          )}
        </div>
      )}

      {open && !showCorrection && (
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden mb-2">
          <a href="/submit" className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 transition text-sm">
            <span className="text-lg">🍹</span>
            <span className="font-medium text-emerald-950">Add a price</span>
          </a>
          <a href="/submit" className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 transition text-sm">
            <span className="text-lg">📸</span>
            <span className="font-medium text-emerald-950">Share a photo</span>
          </a>
          <button onClick={() => setShowCorrection(true)} className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 transition text-sm w-full text-left">
            <span className="text-lg">✏️</span>
            <span className="font-medium text-emerald-950">Suggest correction</span>
          </button>
          <a href="https://madeirafriends.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 transition text-sm border-t border-emerald-50">
            <span className="text-lg">🌐</span>
            <span className="font-medium text-emerald-950">Madeira Friends</span>
          </a>
        </div>
      )}

      <button
        onClick={() => { setOpen(!open); setShowCorrection(false); }}
        className={
          'bg-amber-400 text-emerald-950 w-14 h-14 rounded-full font-bold shadow-lg hover:bg-amber-300 hover:scale-105 transition flex items-center justify-center text-2xl ' +
          (open ? 'rotate-45' : '')
        }
      >
        +
      </button>

    </div>
  )
}
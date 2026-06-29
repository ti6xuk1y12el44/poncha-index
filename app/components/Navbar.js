'use client'

import { useEffect, useState } from 'react'

export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isSolid = solid || scrolled || open

  const links = [
    { href: '/', label: 'Home' },
    { href: '/venues', label: 'Venues' },
    { href: '/changelog', label: 'Updates' },
  ]

  return (
    <nav
      className={
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' +
        (isSolid ? 'bg-[#0c1a0e]/95 backdrop-blur shadow-sm shadow-black/20' : 'bg-transparent')
      }
    >
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-6 md:px-12 py-5">
        <a href="/" className="font-black text-lg tracking-tight text-white transition-colors">
          PONCHA<span className="text-[#c9a84c]">.</span>INDEX
        </a>

        <div className="hidden md:flex justify-center gap-8 font-medium text-white/60">
          {links.map(l => (
            <a key={l.href} href={l.href} className="hover:text-white transition">{l.label}</a>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 text-white"
            aria-label="Toggle menu"
          >
            <span className={'block w-6 h-0.5 bg-current transition-transform ' + (open ? 'rotate-45 translate-y-2' : '')}></span>
            <span className={'block w-6 h-0.5 bg-current transition-opacity ' + (open ? 'opacity-0' : '')}></span>
            <span className={'block w-6 h-0.5 bg-current transition-transform ' + (open ? '-rotate-45 -translate-y-2' : '')}></span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0c1a0e] border-t border-white/10 px-6 py-4 flex flex-col gap-3">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-white/70 font-medium py-1 hover:text-white">{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  )
}
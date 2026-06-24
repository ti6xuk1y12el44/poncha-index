'use client'

import { useEffect, useState } from 'react'

export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isSolid = solid || scrolled
  const textColor = isSolid ? 'text-emerald-900' : 'text-white'

  return (
    <nav
      className={
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' +
        (isSolid ? 'bg-[#fdfbf3]/95 backdrop-blur shadow-sm' : 'bg-transparent')
      }
    >
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center px-6 md:px-12 py-5">
        <a href="/" className={'font-black text-lg tracking-tight transition-colors ' + textColor}>
          PONCHA<span className="text-amber-500">.</span>INDEX
        </a>

        <div className={'hidden md:flex justify-center gap-8 font-medium transition-colors ' + textColor}>
          <a href="/" className="hover:opacity-60">Home</a>
          <a href="/venues" className="hover:opacity-60">Venues</a>
          <a href="/changelog" className="hover:opacity-60">Updates</a>
        </div>

        <div></div>
      </div>
    </nav>
  )
}
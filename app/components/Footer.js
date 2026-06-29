export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="md:col-span-2">
            <p className="font-black text-2xl text-white">PONCHA<span className="text-[#c9a84c]">.</span>INDEX</p>
            <p className="text-white/40 mt-4 max-w-sm leading-relaxed">
              Madeira's living poncha price index. Community-powered, transparent, and always up to date.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Explore</h3>
            <ul className="mt-4 space-y-2 text-white/40">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/venues" className="hover:text-white transition">Venues</a></li>
              <li><a href="/changelog" className="hover:text-white transition">Updates</a></li>
              <li><a href="/submit" className="hover:text-white transition">Contribute</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">About</h3>
            <ul className="mt-4 space-y-2 text-white/40">
              <li>
                <a href="https://madeirafriends.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Madeira Friends
                </a>
              </li>
              <li>Community-powered</li>
              <li>2026</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/30 text-sm">
          <p>Prices may change — always confirm at the venue. Please drink responsibly. You must be 18+ to consume alcohol in Portugal.</p>
          <p className="mt-2">© 2026 Poncha Index · Madeira Friends Tech Lab</p>
        </div>

      </div>
    </footer>
  )
}
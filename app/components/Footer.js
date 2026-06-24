export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100 mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-14">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div className="md:col-span-2">
            <p className="font-black text-2xl text-white">PONCHA<span className="text-amber-400">.</span>INDEX</p>
            <p className="text-emerald-200/70 mt-3 max-w-sm leading-relaxed">
              Madeira's living poncha price index. Find where to drink it, compare real prices, and help keep the data alive — kept by the community.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-emerald-200/70">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/venues" className="hover:text-white transition">Venues</a></li>
              <li><a href="/changelog" className="hover:text-white transition">Updates</a></li>
              <li><a href="/submit" className="hover:text-white transition">Add a price</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white">About</h3>
            <ul className="mt-4 space-y-2 text-emerald-200/70">
              <li>
                <a href="https://madeirafriends.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Madeira Friends Tech Lab
                </a>
              </li>
              <li>Community-powered</li>
              <li>2026</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-emerald-800 mt-12 pt-8 text-center text-emerald-200/50 text-sm">
          <p>Prices may change — always confirm at the venue. Please drink responsibly. You must be 18+ to consume alcohol in Portugal.</p>
          <p className="mt-2">© 2026 Poncha Index · Madeira Friends Tech Lab</p>
        </div>

      </div>
    </footer>
  )
}
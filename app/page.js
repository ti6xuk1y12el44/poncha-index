import { supabase } from './lib/supabase'
// before visual redesign
export default async function Home() {
  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('status', 'active')

  const { data: stats } = await supabase
    .from('price_current')
    .select('price_eur')

  const prices = stats?.map(s => s.price_eur) || []
  const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : null
  const minPrice = prices.length ? Math.min(...prices).toFixed(2) : null
  const maxPrice = prices.length ? Math.max(...prices).toFixed(2) : null

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">

      <section className="px-6 md:px-16 pt-16 pb-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xl">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Poncha <span className="text-amber-400">Index</span>
            </h1>
            <p className="text-stone-400 text-lg mt-4 leading-relaxed">
              The living price index for poncha across Madeira. Find where to drink it, compare prices, and help keep the data alive.
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs uppercase tracking-widest text-stone-500">Island average poncha</p>
            <p className="text-6xl md:text-7xl font-bold text-amber-400 mt-2">
              {avgPrice ? '€' + avgPrice : '€—'}
            </p>
            <p className="text-stone-400 mt-3 text-sm">
              <span className="font-semibold text-stone-200">{stats?.length || 0}</span> verified prices · <span className="font-semibold text-stone-200">{venues?.length || 0}</span> venues
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 max-w-6xl mx-auto">
        <div className="bg-stone-100 text-stone-900 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-serif font-bold">Find your venue</h2>
          <p className="text-stone-500 mt-1">{venues?.length || 0} venues across Madeira</p>
          <input type="text" placeholder="Venue name..." className="mt-6 w-full max-w-2xl mx-auto block px-6 py-4 rounded-2xl border border-stone-300 text-lg" />
          <a href="/submit" className="inline-block mt-6 bg-amber-500 text-stone-900 px-8 py-3 rounded-full font-semibold hover:bg-amber-400">+ Add a poncha price</a>
        </div>
      </section>

      <section className="px-6 md:px-16 max-w-6xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Venues tracked" value={venues?.length || 0} />
        <StatCard label="Verified prices" value={stats?.length || 0} />
        <StatCard label="Cheapest poncha" value={minPrice ? '€' + minPrice : '—'} accent="text-green-400" />
        <StatCard label="Priciest poncha" value={maxPrice ? '€' + maxPrice : '—'} accent="text-red-400" />
      </section>

      <section className="px-6 md:px-16 max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-serif font-bold mb-6">Live from the bar</h2>
        {venues?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {venues.slice(0, 6).map(v => (
              <a key={v.id} href={'/venues/' + v.slug} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-amber-500 transition">
                <h3 className="font-semibold text-lg">{v.name}</h3>
                <p className="text-stone-500 text-sm">{v.municipality}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center text-stone-500">
            No venues yet.
          </div>
        )}
      </section>

      <footer className="px-6 md:px-16 max-w-6xl mx-auto mt-20 py-10 border-t border-stone-800 text-center text-stone-500 text-sm">
        <p>Prices may change — always confirm at the venue. Drink responsibly. You must be 18+ to consume alcohol in Portugal.</p>
        <p className="mt-2">Poncha Index · Madeira Friends Tech Lab · 2026</p>
      </footer>

    </main>
  )
}

function StatCard({ label, value, accent = 'text-amber-400' }) {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center">
      <p className={'text-3xl font-bold ' + accent}>{value}</p>
      <p className="text-stone-500 text-xs uppercase tracking-wider mt-2">{label}</p>
    </div>
  )
}
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import FadeIn from './components/FadeIn'
import CountUp from './components/CountUp'
import MunicipalityStats from './components/MunicipalityStats'
import VenuesMap from './components/VenuesMap'
import Footer from './components/Footer'

export default async function Home() {
  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('status', 'active')

  const { data: stats } = await supabase
    .from('price_current')
    .select('price_eur')

  const { data: currentPrices } = await supabase
    .from('price_current')
    .select('venue_id, price_eur')

  const priceByVenue = {}
  for (const p of currentPrices || []) {
    if (priceByVenue[p.venue_id] == null || p.price_eur < priceByVenue[p.venue_id]) {
      priceByVenue[p.venue_id] = p.price_eur
    }
  }
  const venuesWithPrice = (venues || []).map(v => ({
    ...v,
    price: priceByVenue[v.id] ?? null,
  }))

  const prices = stats?.map(s => s.price_eur) || []
  const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length) : null
  const minPrice = prices.length ? Math.min(...prices) : null
  const maxPrice = prices.length ? Math.max(...prices) : null

  return (
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">

      <Navbar />

{/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-28 pb-16">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80"
          alt="Madeira landscape"
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent" />
        <div className="relative px-6 md:px-12 max-w-6xl mx-auto w-full">
          <p className="uppercase tracking-[0.2em] text-amber-300 text-sm font-semibold">Madeira's traditional drink</p>
          <h1 className="text-white text-5xl md:text-8xl font-black mt-4 leading-none">
            The Poncha<br/>Index
          </h1>
          <p className="text-emerald-50 text-lg mt-6 max-w-xl leading-relaxed">
            Find where to drink poncha across the island, compare real prices, and help keep Madeira's living price index alive.
          </p>

          <div className="mt-10 flex flex-wrap items-end gap-10">
            <div>
              <p className="text-amber-300 text-xs uppercase tracking-widest">Island average</p>
              <p className="text-white text-6xl md:text-7xl font-black mt-1">
                {avgPrice ? <CountUp end={avgPrice} prefix="€" decimals={2} /> : '€—'}
              </p>
            </div>
            <p className="text-emerald-100 mb-2">
              <span className="font-bold text-white">{stats?.length || 0}</span> verified prices<br/>
              <span className="font-bold text-white">{venues?.length || 0}</span> venues listed
            </p>
          </div>

          <a href="/submit" className="inline-block mt-8 bg-amber-400 text-emerald-950 px-8 py-4 rounded-full font-bold hover:bg-amber-300 transition shadow-lg">
            + Add a poncha price
          </a>
        </div>
      </section>

      {/* STAT CARDS */}
      <FadeIn>
      <section className="px-6 md:px-12 max-w-6xl mx-auto -mt-12 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Venues tracked" value={<CountUp end={venues?.length || 0} />} />
        <StatCard label="Verified prices" value={<CountUp end={stats?.length || 0} />} />
        <StatCard label="Cheapest" value={minPrice ? <CountUp end={minPrice} prefix="€" decimals={2} /> : '—'} accent="text-emerald-600" />
        <StatCard label="Priciest" value={maxPrice ? <CountUp end={maxPrice} prefix="€" decimals={2} /> : '—'} accent="text-rose-600" />
      </section>
      </FadeIn>

      {/* MAP */}
      <FadeIn>
      <section className="px-6 md:px-12 max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl md:text-4xl font-black text-emerald-950">Poncha across the island</h2>
        <p className="text-emerald-800/70 mt-1">Green is cheaper, red is pricier. Click a point for details.</p>
        <div className="mt-8">
          <VenuesMap venues={venuesWithPrice} />
        </div>
      </section>
      </FadeIn>

      {/* VENUES */}
      <FadeIn delay={100}>
      <section className="px-6 md:px-12 max-w-6xl mx-auto mt-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-emerald-950">Where to drink poncha</h2>
            <p className="text-emerald-800/70 mt-1">Venues across Madeira serving the real thing.</p>
          </div>
          <a href="/venues" className="text-emerald-700 font-semibold hover:text-emerald-900 hidden md:block">See all →</a>
        </div>

        {venues?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {venues.map(v => (
              <a key={v.id} href={'/venues/' + v.slug} className="group bg-white rounded-3xl p-6 border border-emerald-100 hover:shadow-xl hover:-translate-y-1 hover:border-amber-300 transition duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">🍹</div>
                <h3 className="font-bold text-lg mt-4 text-emerald-950 group-hover:text-emerald-700 transition">{v.name}</h3>
                <p className="text-emerald-800/60 text-sm mt-1">📍 {v.municipality}</p>
                <p className="mt-4 text-amber-600 font-semibold text-sm">View details →</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center text-emerald-800/50 mt-10 border border-emerald-100">
            No venues yet — be the first to add one!
          </div>
        )}
      </section>
      </FadeIn>

      {/* MUNICIPALITY STATS */}
      <FadeIn delay={100}>
        <MunicipalityStats />
      </FadeIn>

      <Footer />

    </main>
  )
}

function StatCard({ label, value, accent = 'text-emerald-700' }) {
  return (
    <div className="bg-white rounded-2xl p-6 text-center border border-emerald-100 shadow-sm">
      <p className={'text-3xl font-black ' + accent}>{value}</p>
      <p className="text-emerald-800/70 text-xs uppercase tracking-wider mt-2 font-medium">{label}</p>
    </div>
  )
}
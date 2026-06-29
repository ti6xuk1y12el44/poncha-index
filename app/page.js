export const dynamic = 'force-dynamic'
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

  const { data: recentApproved } = await supabase
    .from('price_submissions')
    .select('*, venues(name, slug)')
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .limit(5)

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

  const venuesWithRealPrice = venuesWithPrice.filter(v => v.price !== null)
  const cheapestVenue = venuesWithRealPrice.length ? venuesWithRealPrice.reduce((a, b) => a.price < b.price ? a : b) : null
  const priciestVenue = venuesWithRealPrice.length ? venuesWithRealPrice.reduce((a, b) => a.price > b.price ? a : b) : null

  const prices = stats?.map(s => s.price_eur) || []
  const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length) : null

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white">

      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80"
          alt="Madeira"
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0a] via-transparent to-[#0a0f0a]" />

        <div className="relative text-center px-6 max-w-4xl mx-auto">

          <h1 className="text-[clamp(3rem,10vw,9rem)] font-black leading-[0.85] mt-8 tracking-tight">
            <span className="text-white/20">€</span>{avgPrice ? <CountUp end={avgPrice} decimals={2} /> : '—'}
          </h1>
          <p className="text-white/40 text-lg mt-4">average poncha across the island</p>

          <div className="flex justify-center gap-12 mt-10 text-sm">
            <div>
              <p className="text-white font-black text-2xl"><CountUp end={venues?.length || 0} /></p>
              <p className="text-white/30 mt-1">venues</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <p className="text-white font-black text-2xl"><CountUp end={stats?.length || 0} /></p>
              <p className="text-white/30 mt-1">verified prices</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <p className="text-emerald-400 font-black text-2xl">{cheapestVenue ? '€' + cheapestVenue.price.toFixed(2) : '—'}</p>
              <p className="text-white/30 mt-1">cheapest</p>
            </div>
            <div className="w-px bg-white/10"></div>
            <div>
              <p className="text-rose-400 font-black text-2xl">{priciestVenue ? '€' + priciestVenue.price.toFixed(2) : '—'}</p>
              <p className="text-white/30 mt-1">priciest</p>
            </div>
          </div>

          <a href="/submit" className="inline-block mt-12 border border-[#c9a84c] text-[#c9a84c] px-10 py-4 rounded-full font-semibold hover:bg-[#c9a84c] hover:text-[#0a0f0a] transition">
            Contribute a price
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <p className="text-xs uppercase tracking-widest">Scroll</p>
          <div className="w-px h-8 bg-white/20"></div>
        </div>
      </section>

      <FadeIn>
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {cheapestVenue && (
          <a href={'/venues/' + cheapestVenue.slug} className="bg-emerald-950/50 border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/40 transition group">
            <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] font-medium">Cheapest poncha</p>
            <p className="text-4xl md:text-5xl font-black mt-3 text-emerald-400">€{cheapestVenue.price.toFixed(2)}</p>
            <p className="text-white font-semibold text-lg mt-3 group-hover:text-emerald-400 transition">{cheapestVenue.name}</p>
            <p className="text-white/30 text-sm mt-1">{cheapestVenue.municipality}</p>
          </a>
        )}
        {priciestVenue && (
          <a href={'/venues/' + priciestVenue.slug} className="bg-rose-950/30 border border-rose-500/20 rounded-2xl p-8 hover:border-rose-500/40 transition group">
            <p className="text-rose-400 text-xs uppercase tracking-[0.2em] font-medium">Priciest poncha</p>
            <p className="text-4xl md:text-5xl font-black mt-3 text-rose-400">€{priciestVenue.price.toFixed(2)}</p>
            <p className="text-white font-semibold text-lg mt-3 group-hover:text-rose-400 transition">{priciestVenue.name}</p>
            <p className="text-white/30 text-sm mt-1">{priciestVenue.municipality}</p>
          </a>
        )}
      </section>
      </FadeIn>

      <FadeIn>
      <section className="max-w-6xl mx-auto px-6 md:px-12">
        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Explore</p>
        <div className="flex items-end justify-between mt-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-black">Poncha map</h2>
          <p className="text-white/20 text-sm hidden md:block">Tap a point for details</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <VenuesMap venues={venuesWithPrice} />
        </div>
      </section>
      </FadeIn>

      {recentApproved?.length > 0 && (
      <FadeIn>
      <section className="max-w-6xl mx-auto px-6 md:px-12 mt-24">
        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Live</p>
        <h2 className="text-3xl md:text-4xl font-black mt-2">Recent contributions</h2>

        <div className="mt-8 space-y-3">
          {recentApproved.map(sub => (
            <a key={sub.id} href={'/venues/' + (sub.venues?.slug || '')} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-4 hover:bg-white/[0.06] transition">
              <div>
                <p className="font-semibold">{sub.venues?.name || 'Unknown'}</p>
                <p className="text-white/30 text-sm mt-0.5">{sub.contributor_name || 'Anonymous'} · {sub.observed_at}</p>
              </div>
              <p className="text-[#c9a84c] font-black text-xl">€{sub.price_eur}</p>
            </a>
          ))}
        </div>
      </section>
      </FadeIn>
      )}

      <FadeIn>
      <section className="max-w-6xl mx-auto px-6 md:px-12 mt-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Where to drink</p>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Featured venues</h2>
          </div>
          <a href="/venues" className="text-white/40 text-sm hover:text-white transition">See all venues →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {(venues || []).slice(0, 3).map(v => {
            const price = priceByVenue[v.id]
            return (
              <a key={v.id} href={'/venues/' + v.slug} className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#c9a84c] transition">{v.name}</h3>
                    <p className="text-white/30 text-sm mt-1">{v.municipality}</p>
                  </div>
                  {price != null && (
                    <p className="text-2xl font-black text-[#c9a84c]">€{price.toFixed(2)}</p>
                  )}
                </div>
                <div className="mt-8 flex items-center gap-2 text-white/20 text-sm group-hover:text-white/40 transition">
                  <span>View details</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            )
          })}
        </div>
      </section>
      </FadeIn>

      <FadeIn>
        <MunicipalityStats />
      </FadeIn>

      <Footer />

    </main>
  )
}
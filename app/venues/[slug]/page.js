import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default async function VenuePage({ params }) {
  const { slug } = await params

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!venue) {
    return (
      <main className="min-h-screen flex items-center justify-center text-emerald-800 bg-[#fdfbf3]">
        Venue not found.
      </main>
    )
  }

  const { data: current } = await supabase
    .from('price_current')
    .select('*, poncha_types(name)')
    .eq('venue_id', venue.id)

  const { data: history } = await supabase
    .from('price_submissions')
    .select('*, poncha_types(name)')
    .eq('venue_id', venue.id)
    .eq('moderation_status', 'approved')
    .order('observed_at', { ascending: false })

  const mapsUrl = venue.latitude && venue.longitude
    ? 'https://www.google.com/maps/search/?api=1&query=' + venue.latitude + ',' + venue.longitude
    : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((venue.address || '') + ' ' + (venue.municipality || ''))

  const prices = current?.map(c => c.price_eur) || []
  const cheapest = prices.length ? Math.min(...prices).toFixed(2) : null

  return (
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-5xl mx-auto pt-32 pb-14">

        <a href="/venues" className="text-emerald-700 text-sm font-semibold hover:text-emerald-900">← All venues</a>

        <div className="mt-6 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-8 md:p-10 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shrink-0">🍹</div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black">{venue.name}</h1>
              <p className="text-emerald-100 mt-1">📍 {venue.address ? venue.address + ', ' : ''}{venue.municipality}</p>
            </div>
          </div>
          {cheapest && <p className="text-amber-300 mt-6 text-2xl font-bold">From €{cheapest}</p>}
        </div>

        <h2 className="text-2xl md:text-3xl font-black mt-12">Current poncha prices</h2>
        {current?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {current.map(c => (
              <div key={c.poncha_type_id} className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
                <p className="text-emerald-800/60 text-sm font-medium">{c.poncha_types?.name || 'Poncha'}</p>
                <p className="text-4xl font-black text-emerald-700 mt-2">€{c.price_eur}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 mt-6 text-emerald-800/50">
            No confirmed prices yet for this venue.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">

          <div className="bg-emerald-800 text-white rounded-3xl p-8">
            <h2 className="text-xl font-black">Location</h2>
            <p className="text-emerald-100 mt-3">📍 {venue.address ? venue.address + ', ' : ''}{venue.municipality}</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 bg-amber-400 text-emerald-950 px-6 py-3 rounded-full font-bold hover:bg-amber-300 transition">Open in Google Maps</a>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-emerald-100">
            <h2 className="text-xl font-black">Price history</h2>
            {history?.length ? (
              <div className="mt-4 space-y-3">
                {history.map(h => (
                  <div key={h.id} className="flex items-center justify-between border-b border-emerald-50 pb-3 last:border-0">
                    <div>
                      <p className="font-bold text-emerald-700">€{h.price_eur}</p>
                      <p className="text-emerald-800/60 text-sm">{h.poncha_types?.name || 'Poncha'} · {h.observed_at}</p>
                    </div>
                    <p className="text-emerald-800/40 text-sm">{h.contributor_name || 'Anonymous'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-emerald-800/50 mt-4">No approved history yet.</p>
            )}
          </div>

        </div>

        <div className="mt-12 bg-emerald-900 rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-black">Know a price here?</h2>
          <p className="text-emerald-100 mt-2">Help keep the index accurate with the latest poncha price.</p>
          <a href="/submit" className="inline-block mt-6 bg-amber-400 text-emerald-950 px-8 py-3 rounded-full font-bold hover:bg-amber-300 transition">+ Add a price for {venue.name}</a>
        </div>

      </section>
      <Footer /> 
    </main>
  )
}
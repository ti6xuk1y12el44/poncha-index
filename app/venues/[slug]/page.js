export const dynamic = 'force-dynamic'

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
      <main className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center">
        <p className="text-white/40">Venue not found.</p>
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
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-5xl mx-auto pt-32 pb-20">

        <a href="/venues" className="text-white/30 text-sm hover:text-white transition">← All venues</a>

        <div className="mt-8">
          <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">{venue.municipality}</p>
          <h1 className="text-4xl md:text-6xl font-black mt-2">{venue.name}</h1>
          <p className="text-white/40 mt-3">{venue.address ? venue.address + ', ' : ''}{venue.municipality}</p>
          {cheapest && (
            <p className="text-[#c9a84c] text-3xl font-black mt-4">From €{cheapest}</p>
          )}
        </div>

        <div className="mt-14">
          <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Current</p>
          <h2 className="text-2xl font-black mt-2">Poncha prices</h2>
          {current?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {current.map(c => (
                <div key={c.poncha_type_id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                  <p className="text-white/40 text-sm">{c.poncha_types?.name || 'Poncha'}</p>
                  <p className="text-3xl font-black text-[#c9a84c] mt-2">€{c.price_eur}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 mt-6 text-white/30">
              No confirmed prices yet.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-14">

          <div className="bg-[#c9a84c] text-[#0a0f0a] rounded-2xl p-8">
            <h2 className="text-xl font-black">Location</h2>
            <p className="mt-3 text-[#0a0f0a]/70">{venue.address ? venue.address + ', ' : ''}{venue.municipality}</p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 bg-[#0a0f0a] text-[#c9a84c] px-6 py-3 rounded-full font-semibold hover:bg-[#0a0f0a]/80 transition">Open in Google Maps</a>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
            <h2 className="text-xl font-black">Price history</h2>
            {history?.length ? (
              <div className="mt-4 space-y-3">
                {history.map(h => (
                  <div key={h.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                    <div>
                      <p className="font-semibold text-[#c9a84c]">€{h.price_eur}</p>
                      <p className="text-white/30 text-sm">{h.poncha_types?.name || 'Poncha'} · {h.observed_at}</p>
                    </div>
                    <p className="text-white/20 text-sm">{h.contributor_name || 'Anonymous'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 mt-4">No history yet.</p>
            )}
          </div>

        </div>

        <div className="mt-14 border border-white/10 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-black">Know the updated price of this venue?</h2>
          <p className="text-white/40 mt-2">Help keep the index accurate.</p>
          <a href="/submit" className="inline-block mt-6 bg-[#c9a84c] text-[#0a0f0a] px-8 py-3 rounded-full font-bold hover:bg-[#d4b65c] transition">Add a price for {venue.name}</a>
        </div>

      </section>

      <Footer />
    </main>
  )
}
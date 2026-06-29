import { supabase } from '../lib/supabase'

export default async function MunicipalityStats() {
  const { data } = await supabase
    .from('price_current')
    .select('price_eur, venues(municipality)')

  const byMunicipality = {}
  for (const row of data || []) {
    const m = row.venues?.municipality
    if (!m) continue
    if (!byMunicipality[m]) byMunicipality[m] = []
    byMunicipality[m].push(row.price_eur)
  }

  const municipalities = Object.entries(byMunicipality).map(([name, prices]) => ({
    name,
    avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    count: prices.length,
  })).sort((a, b) => a.avg - b.avg)

  if (municipalities.length === 0) {
    return null
  }

  const maxAvg = Math.max(...municipalities.map(m => m.avg))

  return (
    <section className="px-6 md:px-12 max-w-6xl mx-auto mt-24">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Compare</p>
      <h2 className="text-3xl md:text-4xl font-black mt-2">Prices by municipality</h2>
      <p className="text-white/40 mt-1">Average poncha price, cheapest first.</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-8 space-y-5">
        {municipalities.map((m, i) => (
          <div key={m.name}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-semibold text-white">
                {i === 0 && <span className="text-[#c9a84c] mr-2">★</span>}{m.name}
                <span className="text-white/30 text-sm font-normal ml-2">({m.count} {m.count === 1 ? 'price' : 'prices'})</span>
              </span>
              <span className="font-black text-[#c9a84c]">€{m.avg.toFixed(2)}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c9a84c] to-[#a08535] rounded-full"
                style={{ width: (m.avg / maxAvg * 100) + '%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
import { supabase } from '../lib/supabase'

export default async function MunicipalityStats() {
  // buscar preços atuais com o municipio do venue
  const { data } = await supabase
    .from('price_current')
    .select('price_eur, venues(municipality)')

  // agrupa por municipio
  const byMunicipality = {}
  for (const row of data || []) {
    const m = row.venues?.municipality
    if (!m) continue
    if (!byMunicipality[m]) byMunicipality[m] = []
    byMunicipality[m].push(row.price_eur)
  }

  // calcula media de cada municipio
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
    <section className="px-6 md:px-12 max-w-6xl mx-auto mt-20">
      <h2 className="text-3xl md:text-4xl font-black text-emerald-950">Prices by municipality</h2>
      <p className="text-emerald-800/70 mt-1">Average poncha price across Madeira, cheapest first.</p>

      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm mt-8 space-y-5">
        {municipalities.map((m, i) => (
          <div key={m.name}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-bold text-emerald-950">
                {i === 0 && '🏆 '}{m.name}
                <span className="text-emerald-800/40 text-sm font-normal ml-2">({m.count} {m.count === 1 ? 'price' : 'prices'})</span>
              </span>
              <span className="font-black text-emerald-700">€{m.avg.toFixed(2)}</span>
            </div>
            <div className="h-3 bg-emerald-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full"
                style={{ width: (m.avg / maxAvg * 100) + '%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
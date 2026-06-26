export const dynamic = 'force-dynamic'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default async function ChangelogPage() {
  const { data: updates } = await supabase
    .from('price_submissions')
    .select('*, venues(name, slug), poncha_types(name)')
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-3xl mx-auto pt-32 pb-20">

        <h1 className="text-4xl md:text-5xl font-black">Updates</h1>
        <p className="text-emerald-800/70 mt-2">Every approved price update, newest first. Full transparency.</p>

        {updates?.length ? (
          <div className="mt-10 space-y-4">
            {updates.map(u => (
              <div key={u.id} className="bg-white rounded-3xl p-6 border border-emerald-100 flex items-center justify-between">
                <div>
                  <a href={'/venues/' + (u.venues?.slug || '')} className="font-bold text-lg text-emerald-950 hover:text-emerald-700 transition">
                    {u.venues?.name || 'Unknown venue'}
                  </a>
                  <p className="text-emerald-800/60 text-sm mt-1">
                    {u.poncha_types?.name || 'Poncha'} · observed {u.observed_at} · by {u.contributor_name || 'Anonymous'}
                  </p>
                </div>
                <p className="text-2xl font-black text-emerald-700 shrink-0 ml-4">€{u.price_eur}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center text-emerald-800/50 mt-10 border border-emerald-100">
            No approved updates yet.
          </div>
        )}

      </section>
      <Footer />
    </main>
  )
}
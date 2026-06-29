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
    <main className="min-h-screen bg-[#0a0f0a] text-white">
      <Navbar solid={true} />

      <section className="px-6 md:px-12 max-w-3xl mx-auto pt-32 pb-20">

        <p className="text-[#c9a84c] text-xs uppercase tracking-[0.2em] font-medium">Transparency</p>
        <h1 className="text-4xl md:text-5xl font-black mt-2">Updates</h1>
        <p className="text-white/40 mt-2">Every approved price update, newest first.</p>

        {updates?.length ? (
          <div className="mt-10 space-y-3">
            {updates.map(u => (
              <a key={u.id} href={'/venues/' + (u.venues?.slug || '')} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-2xl px-6 py-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition">
                <div>
                  <p className="font-semibold group-hover:text-[#c9a84c] transition">{u.venues?.name || 'Unknown venue'}</p>
                  <p className="text-white/30 text-sm mt-1">
                    {u.poncha_types?.name || 'Poncha'} · {u.observed_at} · {u.contributor_name || 'Anonymous'}
                  </p>
                </div>
                <p className="text-[#c9a84c] font-black text-xl shrink-0 ml-4">€{u.price_eur}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-10 text-center text-white/30 mt-10">
            No approved updates yet.
          </div>
        )}

      </section>
      <Footer />
    </main>
  )
}
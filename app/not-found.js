import Navbar from './components/Navbar'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fdfbf3] text-emerald-950">
      <Navbar solid={true} />
      <section className="px-6 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-6xl font-black mt-6">404</h1>
        <p className="text-emerald-800/70 mt-3 text-lg max-w-md">
          Let's get you back to the Poncha Index.
        </p>
        <a href="/" className="inline-block mt-8 bg-amber-400 text-emerald-950 px-8 py-4 rounded-full font-bold hover:bg-amber-300 transition">
          Back to home
        </a>
      </section>
    </main>
  )
}
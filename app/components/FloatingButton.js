export default function FloatingButton() {
  return (
    
    <a  href="/submit"
      className="fixed bottom-6 right-6 z-40 bg-amber-400 text-emerald-950 px-6 py-4 rounded-full font-bold shadow-lg hover:bg-amber-300 hover:scale-105 transition flex items-center gap-2"
    >
      <span className="text-xl">🍹</span>
      <span className="hidden sm:inline">Add a poncha price</span>
    </a>
  )
}
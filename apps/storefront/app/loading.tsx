export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white animate-pulse">
      <div className="h-16 bg-white border-b border-stone-100" />
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="h-[60vh] rounded-2xl bg-stone-200" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-stone-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

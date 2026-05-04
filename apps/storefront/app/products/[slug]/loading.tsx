export default function ProductLoading() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-pulse">
        <div className="aspect-square rounded-2xl bg-stone-200" />
        <div className="flex flex-col gap-4">
          <div className="h-3 w-24 rounded bg-stone-200" />
          <div className="h-9 w-3/4 rounded bg-stone-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-stone-200" />
            <div className="h-4 w-5/6 rounded bg-stone-200" />
            <div className="h-4 w-4/6 rounded bg-stone-200" />
          </div>
          <div className="h-8 w-32 rounded bg-stone-200" />
        </div>
      </div>
    </section>
  );
}

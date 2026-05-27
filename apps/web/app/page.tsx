import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-semibold text-lg">FormForge</span>
        <nav className="flex gap-4 text-sm">
          <Link href="/explore" className="text-zinc-400 hover:text-white">
            Explore
          </Link>
          <Link href="/pricing" className="text-zinc-400 hover:text-white">
            Pricing
          </Link>
          <Link href="/login" className="text-zinc-400 hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Build forms that feel{" "}
          <span className="text-indigo-400">alive</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
          Typeform-style builder with themes, analytics, public explore, and a
          documented REST API. Try the demo account after seeding the database.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-medium"
          >
            Start free
          </Link>
          <Link
            href="/f/cyberpunk-fan-survey-demo"
            className="border border-zinc-700 px-6 py-3 rounded-lg hover:bg-zinc-900"
          >
            View demo form
          </Link>
        </div>
        <p className="text-xs text-zinc-600 mt-12">
          Demo: demo@formforge.dev / demo1234 (after pnpm db:seed)
        </p>
      </main>
    </div>
  );
}

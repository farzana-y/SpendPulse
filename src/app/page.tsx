import Link from "next/link";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-28 text-center">

        {/* Subtle glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/50 px-4 py-1.5 text-sm text-emerald-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Free for founders and engineering teams
        </div>

        <h1 className="relative max-w-3xl text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
          Stop overpaying for
          <span className="text-emerald-400"> AI tools</span>
        </h1>

        <p className="relative mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed">
          Audit your AI subscriptions in 60 seconds. See exactly where
          you're overspending, what overlaps, and how much you could save.
        </p>

        <div className="relative mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/audit"
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3.5 text-base transition-colors"
          >
            Get My Free Audit →
          </Link>
          <p className="text-sm text-zinc-600">
            No login required · Results in 60 seconds
          </p>
        </div>

        {/* Social proof */}
        <div className="relative mt-16 flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
          <span>✓ Cursor</span>
          <span>✓ ChatGPT</span>
          <span>✓ Claude</span>
          <span>✓ GitHub Copilot</span>
          <span>✓ Gemini</span>
          <span>✓ Windsurf</span>
          <span>✓ v0</span>
          <span>✓ API direct</span>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <h2 className="text-center text-2xl font-bold text-zinc-200 mb-12">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Add your subscriptions",
              desc: "Tell us which AI tools you pay for, which plan, and how many seats.",
            },
            {
              step: "02",
              title: "Get your instant audit",
              desc: "Our engine checks for overspend, wrong-sized plans, and overlapping tools.",
            },
            {
              step: "03",
              title: "See your savings",
              desc: "Get a clear breakdown of what to cut, switch, or downgrade — with the math.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <p className="text-emerald-500 font-mono text-sm font-bold mb-3">
                {item.step}
              </p>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-6 flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M3 12L6 7L9 9.5L13 4" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>SpendPulse by Farzana </span>
        </div>
        <p>Free · No login required</p>
      </footer>

    </main>
  );
}
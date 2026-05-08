import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
          Stop Overpaying for AI Tools
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Audit your AI subscriptions, uncover overlapping spend,
          and discover cheaper alternatives in under 60 seconds.
        </p>

        <Link
          href="/audit"
          className="mt-8 rounded-xl bg-black px-6 py-3 text-white transition hover:opacity-90"
        >
          Start Free Audit
        </Link>
      </section>
    </main>
  );
}
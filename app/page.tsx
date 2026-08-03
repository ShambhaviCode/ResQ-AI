import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Users, Waves } from 'lucide-react';

const highlights = [
  {
    title: 'Instant intake',
    description: 'Citizens report incidents with media, location, and urgency in seconds.',
    icon: ShieldCheck,
  },
  {
    title: 'AI triage',
    description: 'The system turns raw reports into clear summaries and resource recommendations.',
    icon: Sparkles,
  },
  {
    title: 'Live coordination',
    description: 'Volunteers and admins operate from one premium mission surface in real time.',
    icon: Users,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="rounded-[32px] border border-white/10 bg-slate-900/70 px-8 py-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">ResQ AI</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Emergency response, reimagined.</h1>
            </div>
            <nav className="flex items-center gap-3 text-sm text-slate-300">
              <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">Login</Link>
              <Link href="/signup" className="rounded-full bg-brand-500 px-4 py-2 font-medium text-white transition hover:bg-brand-600">Get started</Link>
            </nav>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-brand-600/20 via-slate-900 to-slate-950 p-8 shadow-soft">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">
              <Waves className="h-4 w-4" />
              Coordinated disaster response for every minute that matters
            </div>
            <h2 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Turn chaotic incidents into coordinated rescue operations.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Citizens report in seconds, AI triages the severity, and volunteers and admins coordinate from one premium command surface designed for high-stakes moments.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/incident/new" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:bg-slate-200">
                Report incident <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="rounded-full border border-white/15 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10">
                Sign in to workspace
              </Link>
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-slate-900/70 p-8 shadow-soft backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Live incident snapshot</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">3 active missions</h3>
              </div>
              <div className="rounded-full border border-rescue/30 bg-rescue/15 px-3 py-1 text-sm font-medium text-rescue">Operational</div>
            </div>
            <div className="mt-8 space-y-4">
              {[
                ['Riverfront blockage', 'High priority', '12 volunteers'],
                ['Warehouse fire', 'Critical', '4 responders'],
                ['Medical drop-off', 'Medium', '7 volunteers'],
              ].map(([title, level, volunteers]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{title}</p>
                    <span className="text-sm text-brand-200">{level}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{volunteers} connected • AI summary ready</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-soft">
                <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}

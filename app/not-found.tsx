import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-10 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">This route is unavailable</h1>
        <p className="mt-3 text-sm text-slate-400">The page you are looking for does not exist or may have moved.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-brand-500 px-4 py-3 font-medium text-white transition hover:bg-brand-600">
          Return home
        </Link>
      </div>
    </main>
  );
}

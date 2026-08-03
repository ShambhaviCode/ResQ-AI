'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toaster';
import { getStoredUser, setStoredUser, type StoredUser } from '@/lib/resq-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { pushToast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const storedUser = getStoredUser();
    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
      pushToast('No matching account found. Please sign up first.', 'error');
      return;
    }

    setStoredUser(storedUser);
    pushToast('Welcome back. Routing to your workspace.', 'success');
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-soft backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">Access portal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-3 text-sm text-slate-400">Sign in to manage live incidents and volunteer operations.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0" placeholder="ops@resq.ai" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          New here? <Link href="/signup" className="text-brand-200">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

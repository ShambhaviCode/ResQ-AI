'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toaster';
import { setStoredUser, type StoredUser, type UserRole } from '@/lib/resq-store';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Citizen');
  const { pushToast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role,
    };
    setStoredUser(user);
    pushToast('Account created successfully. Welcome to ResQ AI.', 'success');
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-soft backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-200">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Join the response network</h1>
        <p className="mt-3 text-sm text-slate-400">Choose your role and start contributing to live missions.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0" placeholder="Mina Alvarez" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0" placeholder="mina@resq.ai" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0" placeholder="••••••••" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300" htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none ring-0">
              <option value="Citizen">Citizen</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          Already registered? <Link href="/login" className="text-brand-200">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

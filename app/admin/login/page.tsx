'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const { token } = await adminLogin(String(form.get('email')), String(form.get('password')));
      setToken(token);
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md px-4">
      <form onSubmit={onSubmit} className="glass-card space-y-4 p-6">
        <h1 className="text-2xl font-bold text-gold-400">Admin Login</h1>
        <input name="email" required placeholder="Admin email" className="w-full rounded-lg border border-white/10 bg-white/5 p-3" />
        <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border border-white/10 bg-white/5 p-3" />
        <button className="w-full rounded-lg bg-gold-500 px-4 py-2 font-semibold text-navy-950">Login</button>
        {error && <p className="text-red-300">{error}</p>}
      </form>
    </div>
  );
}

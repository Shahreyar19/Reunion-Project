'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearToken, getToken } from '@/lib/auth';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.push('/admin/login');
  }, [router]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[220px_1fr]">
      <aside className="glass-card h-fit p-4">
        <nav className="space-y-2 text-sm">
          <Link href="/admin/dashboard" className="block rounded p-2 hover:bg-white/10">Dashboard</Link>
          <Link href="/admin/registrations" className="block rounded p-2 hover:bg-white/10">Registrations</Link>
          <Link href="/admin/gallery" className="block rounded p-2 hover:bg-white/10">Photo Moderation</Link>
          <Link href="/admin/announcements" className="block rounded p-2 hover:bg-white/10">Announcements</Link>
          <Link href="/admin/settings" className="block rounded p-2 hover:bg-white/10">Event Settings</Link>
          <button onClick={() => { clearToken(); router.push('/admin/login'); }} className="w-full rounded bg-red-400/20 p-2 text-left text-red-200">Logout</button>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}

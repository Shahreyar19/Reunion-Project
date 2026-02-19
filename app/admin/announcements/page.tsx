'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getAnnouncements, postAnnouncement } from '@/lib/api';

export default function AnnouncementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  async function refresh() {
    const data = await getAnnouncements();
    setItems(data);
  }

  useEffect(() => {
    refresh().catch(() => setItems([]));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await postAnnouncement(String(fd.get('title')), String(fd.get('message')));
    setMsg('Announcement posted');
    e.currentTarget.reset();
    await refresh();
  }

  return (
    <AdminShell>
      <h1 className="section-title">Announcements</h1>
      <form onSubmit={onSubmit} className="glass-card mt-6 space-y-4 p-6">
        <input name="title" required placeholder="Title" className="w-full rounded-lg border border-white/10 bg-white/5 p-3" />
        <textarea name="message" required placeholder="Message" className="h-32 w-full rounded-lg border border-white/10 bg-white/5 p-3" />
        <button className="rounded bg-gold-500 px-4 py-2 font-semibold text-navy-950">Post Announcement</button>
        {msg && <p className="text-sm text-white/70">{msg}</p>}
      </form>
      <div className="mt-4 space-y-2">
        {items.map((x) => <div key={x.id} className="glass-card p-4"><p className="font-semibold">{x.title}</p><p className="text-sm text-white/70">{x.message}</p></div>)}
      </div>
    </AdminShell>
  );
}

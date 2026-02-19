'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getEventInfo, saveEventInfo } from '@/lib/api';

export default function AdminSettingsPage() {
  const [message, setMessage] = useState('');
  const [defaults, setDefaults] = useState<any>(null);

  useEffect(() => {
    getEventInfo().then(setDefaults).catch(() => setDefaults(null));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await saveEventInfo({
      event_date: String(fd.get('event_date')),
      venue: String(fd.get('venue')),
      map_embed_url: String(fd.get('map_embed_url')),
      about: String(fd.get('about'))
    });
    setMessage('Event information saved.');
  }

  return (
    <AdminShell>
      <h1 className="section-title">Event Settings</h1>
      <form onSubmit={onSubmit} className="glass-card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <input name="event_date" defaultValue={defaults?.event_date || ''} placeholder="Event date" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input name="venue" defaultValue={defaults?.venue || ''} placeholder="Venue" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input name="map_embed_url" defaultValue={defaults?.map_embed_url || ''} placeholder="Map embed URL" className="rounded-lg border border-white/10 bg-white/5 p-3 md:col-span-2" />
        <textarea name="about" defaultValue={defaults?.about || ''} placeholder="About section" className="h-32 rounded-lg border border-white/10 bg-white/5 p-3 md:col-span-2" />
        <button className="rounded bg-gold-500 px-4 py-2 font-semibold text-navy-950 md:col-span-2">Save Changes</button>
        {message && <p className="text-sm text-white/70 md:col-span-2">{message}</p>}
      </form>
    </AdminShell>
  );
}

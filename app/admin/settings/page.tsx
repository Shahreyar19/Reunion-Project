'use client';

import { AdminShell } from '@/components/admin-shell';

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <h1 className="section-title">Event Settings</h1>
      <form className="glass-card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <input placeholder="Event date" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input placeholder="Venue" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input placeholder="Map embed URL" className="rounded-lg border border-white/10 bg-white/5 p-3 md:col-span-2" />
        <textarea placeholder="About section" className="h-32 rounded-lg border border-white/10 bg-white/5 p-3 md:col-span-2" />
        <button className="rounded bg-gold-500 px-4 py-2 font-semibold text-navy-950 md:col-span-2">Save Changes</button>
      </form>
    </AdminShell>
  );
}

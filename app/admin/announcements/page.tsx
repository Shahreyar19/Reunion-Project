'use client';

import { AdminShell } from '@/components/admin-shell';

export default function AnnouncementsPage() {
  return (
    <AdminShell>
      <h1 className="section-title">Announcements</h1>
      <form className="glass-card mt-6 space-y-4 p-6">
        <input placeholder="Title" className="w-full rounded-lg border border-white/10 bg-white/5 p-3" />
        <textarea placeholder="Message" className="h-32 w-full rounded-lg border border-white/10 bg-white/5 p-3" />
        <button className="rounded bg-gold-500 px-4 py-2 font-semibold text-navy-950">Post Announcement</button>
      </form>
    </AdminShell>
  );
}

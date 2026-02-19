'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getDashboardStats } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ registrations: 0, pending: 0, approved: 0, announcements: 0 });

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => undefined);
  }, []);

  return (
    <AdminShell>
      <h1 className="section-title">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ['Total Registrations', String(stats.registrations)],
          ['Pending Photos', String(stats.pending)],
          ['Approved Photos', String(stats.approved)],
          ['Announcements', String(stats.announcements)]
        ].map(([label, value]) => (
          <div key={label} className="glass-card p-5">
            <p className="text-sm text-white/70">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gold-400">{value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

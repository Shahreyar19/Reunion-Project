'use client';

import { AdminShell } from '@/components/admin-shell';

export default function DashboardPage() {
  return (
    <AdminShell>
      <h1 className="section-title">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ['Total Registrations', '248'],
          ['Pending Photos', '32'],
          ['Approved Photos', '120'],
          ['Announcements', '6']
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

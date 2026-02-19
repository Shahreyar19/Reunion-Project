'use client';

import { AdminShell } from '@/components/admin-shell';

export default function RegistrationsPage() {
  return (
    <AdminShell>
      <h1 className="section-title">Registrations</h1>
      <div className="glass-card mt-6 overflow-x-auto p-4">
        <p className="mb-4 text-sm text-white/70">Use worker endpoint: /admin/registrations and /admin/export-csv</p>
        <button className="rounded bg-gold-500 px-4 py-2 font-semibold text-navy-950">Export CSV</button>
      </div>
    </AdminShell>
  );
}

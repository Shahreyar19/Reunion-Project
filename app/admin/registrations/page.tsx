'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { exportRegistrationsCsv, getRegistrations } from '@/lib/api';

export default function RegistrationsPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    getRegistrations().then(setRows).catch(() => setRows([]));
  }, []);

  async function onExport() {
    const csv = await exportRegistrationsCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'registrations.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <AdminShell>
      <h1 className="section-title">Registrations</h1>
      <div className="glass-card mt-6 overflow-x-auto p-4">
        <button onClick={onExport} className="mb-4 rounded bg-gold-500 px-4 py-2 font-semibold text-navy-950">Export CSV</button>
        <table className="w-full text-sm">
          <thead className="text-left text-white/70">
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Profession</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="py-2">{r.name}</td><td>{r.email}</td><td>{r.phone}</td><td>{r.department}</td><td>{r.profession}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

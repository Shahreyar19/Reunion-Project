'use client';

import { AdminShell } from '@/components/admin-shell';

export default function AdminGalleryPage() {
  return (
    <AdminShell>
      <h1 className="section-title">Photo Moderation</h1>
      <div className="glass-card mt-6 p-4 text-white/80">
        Approve/reject/delete images through Worker APIs: /approve-image and /delete-image.
      </div>
    </AdminShell>
  );
}

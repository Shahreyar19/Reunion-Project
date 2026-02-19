'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminShell } from '@/components/admin-shell';
import { approveImage, deleteImage, getPendingGallery } from '@/lib/api';
import type { GalleryImage } from '@/lib/types';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  async function refresh() {
    const data = await getPendingGallery();
    setImages(data);
  }

  useEffect(() => {
    refresh().catch(() => setImages([]));
  }, []);

  async function moderate(id: number, status: 'approved' | 'rejected') {
    await approveImage(id, status);
    await refresh();
  }

  async function remove(id: number) {
    await deleteImage(id);
    await refresh();
  }

  return (
    <AdminShell>
      <h1 className="section-title">Photo Moderation</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {images.map((img) => (
          <div key={img.id} className="glass-card overflow-hidden">
            <Image src={img.url} alt={img.caption} width={600} height={300} className="h-48 w-full object-cover" />
            <div className="space-y-2 p-4">
              <p className="text-sm text-white/80">{img.caption}</p>
              <p className="text-xs uppercase text-white/50">{img.status}</p>
              <div className="flex gap-2">
                <button onClick={() => moderate(img.id, 'approved')} className="rounded bg-green-500 px-3 py-1 text-xs font-semibold text-black">Approve</button>
                <button onClick={() => moderate(img.id, 'rejected')} className="rounded bg-yellow-500 px-3 py-1 text-xs font-semibold text-black">Reject</button>
                <button onClick={() => remove(img.id)} className="rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

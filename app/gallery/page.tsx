'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getGallery } from '@/lib/api';
import { Section } from '@/components/section';
import type { GalleryImage } from '@/lib/types';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGallery()
      .then(setGallery)
      .catch(() => setGallery([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Section title="Approved Gallery">
      {loading && <p className="text-white/70">Loading gallery...</p>}
      <div className="grid gap-6 md:grid-cols-3">
        {gallery.map((image) => (
          <figure key={image.id} className="glass-card overflow-hidden">
            <Image src={image.url} alt={image.caption} width={480} height={320} className="h-56 w-full object-cover" />
            <figcaption className="p-4 text-sm text-white/80">{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      {!loading && gallery.length === 0 && <p className="text-white/70">No approved images yet.</p>}
    </Section>
  );
}

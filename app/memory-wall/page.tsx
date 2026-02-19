'use client';

import { FormEvent, useState } from 'react';
import { uploadMemory } from '@/lib/api';
import { Section } from '@/components/section';

export default function MemoryWallPage() {
  const [status, setStatus] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await uploadMemory(form);
      setStatus('Your memory was submitted and is pending approval.');
      event.currentTarget.reset();
    } catch {
      setStatus('Submission failed. Please try again.');
    }
  }

  return (
    <Section title="Memory Wall">
      <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6">
        <textarea name="caption" required placeholder="Share a memory..." className="h-32 w-full rounded-lg border border-white/10 bg-white/5 p-3" />
        <input type="file" name="image" accept="image/*" required className="w-full text-sm" />
        <button className="rounded-lg bg-gold-500 px-4 py-2 font-semibold text-navy-950">Submit Memory</button>
        {status && <p className="text-sm text-white/80">{status}</p>}
      </form>
    </Section>
  );
}

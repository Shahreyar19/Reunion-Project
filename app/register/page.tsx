'use client';

import { FormEvent, useState } from 'react';
import { registerParticipant } from '@/lib/api';
import { Section } from '@/components/section';

export default function RegisterPage() {
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name')),
      phone: String(formData.get('phone')),
      email: String(formData.get('email')),
      department: String(formData.get('department')),
      profession: String(formData.get('profession'))
    };

    try {
      const response = await registerParticipant(payload);
      setMessage(`Registration successful. Your QR code: ${response.qrCodeDataUrl ? 'Generated' : 'Pending'}`);
      event.currentTarget.reset();
    } catch {
      setMessage('Registration failed. Please try again.');
    }
  }

  return (
    <Section title="Reunion Registration">
      <form onSubmit={onSubmit} className="glass-card grid gap-4 p-6 md:grid-cols-2">
        <input name="name" required placeholder="Full name" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input name="phone" required placeholder="Phone" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input type="email" name="email" required placeholder="Email" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input name="department" required placeholder="Department" className="rounded-lg border border-white/10 bg-white/5 p-3" />
        <input name="profession" required placeholder="Profession" className="rounded-lg border border-white/10 bg-white/5 p-3 md:col-span-2" />
        <button className="rounded-lg bg-gold-500 px-4 py-3 font-semibold text-navy-950 md:col-span-2">Register Now</button>
        {message && <p className="text-sm text-white/80 md:col-span-2">{message}</p>}
      </form>
    </Section>
  );
}

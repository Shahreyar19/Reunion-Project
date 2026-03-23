'use client';

import { useEffect, useState } from 'react';
import { REUNION_DATE } from '@/lib/constants';

function calcRemaining() {
  const diff = new Date(REUNION_DATE).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60)
  };
}

export function CountdownTimer() {
  const [left, setLeft] = useState(calcRemaining());

  useEffect(() => {
    const timer = setInterval(() => setLeft(calcRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Object.entries(left).map(([label, value]) => (
        <div key={label} className="glass-card p-4 text-center shadow-glow">
          <p className="text-3xl font-bold text-gold-400">{value}</p>
          <p className="uppercase tracking-widest text-xs text-white/70">{label}</p>
        </div>
      ))}
    </div>
  );
}

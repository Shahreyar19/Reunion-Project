'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  ['Home', '/'],
  ['Gallery', '/gallery'],
  ['Memory Wall', '/memory-wall'],
  ['Register', '/register'],
  ['Contact', '/contact'],
  ['Admin', '/admin/login']
];

export function Navigation() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-gold-400">AGC Batch 2020</Link>
        <div className="hidden gap-1 md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'rounded-lg px-3 py-2 text-sm transition',
                pathname === href ? 'bg-gold-500 text-navy-950' : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

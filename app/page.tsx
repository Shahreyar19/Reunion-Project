import { CountdownTimer } from '@/components/countdown';
import { Section } from '@/components/section';

const schedule = [
  ['10:00 AM', 'Welcome Breakfast & Networking'],
  ['11:00 AM', 'Opening Ceremony & Batch Roll Call'],
  ['12:30 PM', 'Campus Memory Walk'],
  ['02:00 PM', 'Cultural Performances'],
  ['04:00 PM', 'Awards & Closing Notes']
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-hero-gradient">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-28">
          <p className="text-sm uppercase tracking-[0.3em] text-gold-400">Reunion 2026</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">Amla Government College Batch 2020</h1>
          <p className="mx-auto mt-6 max-w-3xl text-white/80">A premium reunion experience to relive memories, reconnect with classmates, and celebrate our journey.</p>
          <div className="mt-10">
            <CountdownTimer />
          </div>
        </div>
      </section>

      <Section title="About The Batch">
        <div className="glass-card p-6 text-white/80">
          Batch 2020 stood resilient through changing times and emerged with unforgettable friendships. This reunion is dedicated to celebrating growth, gratitude, and lifelong connections.
        </div>
      </Section>

      <Section title="Event Details">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-6">
            <p><span className="text-gold-400">Date:</span> 18 January 2026</p>
            <p className="mt-2"><span className="text-gold-400">Venue:</span> Amla Government College Auditorium</p>
            <p className="mt-2 text-white/70">Amla, Madhya Pradesh</p>
          </div>
          <iframe className="h-64 w-full rounded-2xl border border-white/10" src="https://maps.google.com/maps?q=Amla%20Government%20College&t=&z=13&ie=UTF8&iwloc=&output=embed" loading="lazy" />
        </div>
      </Section>

      <Section title="Program Timeline">
        <ol className="space-y-4">
          {schedule.map(([time, item]) => (
            <li key={time} className="glass-card flex items-center gap-4 p-4">
              <span className="rounded-lg bg-gold-500 px-3 py-1 text-sm font-semibold text-navy-950">{time}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

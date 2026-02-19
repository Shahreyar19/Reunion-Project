import { Section } from '@/components/section';

export default function ContactPage() {
  return (
    <Section title="Contact & Organizers">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Reunion Lead', 'Priya Sharma', '+91 9876543210'],
          ['Registration Desk', 'Rahul Verma', '+91 9123456780'],
          ['Media Coordinator', 'Neha Patel', '+91 9988776655']
        ].map(([role, name, phone]) => (
          <div key={role} className="glass-card p-5">
            <p className="text-gold-400">{role}</p>
            <p className="mt-2 text-xl font-semibold">{name}</p>
            <p className="text-white/70">{phone}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

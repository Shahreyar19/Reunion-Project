export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="section-title">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

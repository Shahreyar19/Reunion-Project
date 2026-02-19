-- Supabase (PostgreSQL) schema for reunion app

create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text not null,
  department text not null,
  profession text not null,
  qr_code_url text,
  created_at timestamptz default now()
);

create table if not exists public.gallery_images (
  id bigint generated always as identity primary key,
  url text not null,
  caption text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  user_id uuid default auth.uid(),
  created_at timestamptz default now()
);

create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  title text not null,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists public.event_settings (
  id int primary key,
  event_date text,
  venue text,
  map_embed_url text,
  about text
);

-- RLS
alter table public.registrations enable row level security;
alter table public.gallery_images enable row level security;
alter table public.announcements enable row level security;
alter table public.event_settings enable row level security;

-- Public read-only on approved gallery & announcements & event settings
create policy "public can read approved gallery"
on public.gallery_images for select
using (status = 'approved');

create policy "public can insert gallery"
on public.gallery_images for insert
with check (true);

create policy "public can register"
on public.registrations for insert
with check (true);

create policy "public can read announcements"
on public.announcements for select
using (true);

create policy "public can read event settings"
on public.event_settings for select
using (true);

-- Admin policy via Supabase Auth user metadata role=admin
create policy "admin full registrations"
on public.registrations for all
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

create policy "admin full gallery"
on public.gallery_images for all
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

create policy "admin full announcements"
on public.announcements for all
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

create policy "admin full event settings"
on public.event_settings for all
using ((auth.jwt() ->> 'role') = 'admin')
with check ((auth.jwt() ->> 'role') = 'admin');

-- Reunion project SQL tables (Supabase/PostgreSQL)
-- Run in Supabase SQL Editor

-- 1) Admin/auth users profile table (optional app-side metadata)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- 2) Registrations
create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text not null,
  department text not null,
  profession text not null,
  qr_code_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_registrations_email on public.registrations(email);
create index if not exists idx_registrations_created_at on public.registrations(created_at desc);

-- 3) Gallery images (moderation workflow)
create table if not exists public.gallery_images (
  id bigint generated always as identity primary key,
  url text not null,
  caption text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  user_id uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists idx_gallery_images_status on public.gallery_images(status);
create index if not exists idx_gallery_images_created_at on public.gallery_images(created_at desc);

-- 4) Announcements
create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  title text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_announcements_created_at on public.announcements(created_at desc);

-- 5) Event settings (single row, id=1)
create table if not exists public.event_settings (
  id int primary key,
  event_date text,
  venue text,
  map_embed_url text,
  about text,
  updated_at timestamptz not null default now()
);

insert into public.event_settings(id, event_date, venue, map_embed_url, about)
values (
  1,
  '2026-01-18',
  'Amla Government College Auditorium',
  'https://maps.google.com/maps?q=Amla%20Government%20College&t=&z=13&ie=UTF8&iwloc=&output=embed',
  'Welcome back Batch 2020!'
)
on conflict (id) do nothing;

-- ==========================
-- RLS + Policies
-- ==========================
alter table public.users enable row level security;
alter table public.registrations enable row level security;
alter table public.gallery_images enable row level security;
alter table public.announcements enable row level security;
alter table public.event_settings enable row level security;

-- Cleanup (re-runnable)
drop policy if exists "public read approved gallery" on public.gallery_images;
drop policy if exists "public create pending gallery" on public.gallery_images;
drop policy if exists "public create registration" on public.registrations;
drop policy if exists "public read announcements" on public.announcements;
drop policy if exists "public read event settings" on public.event_settings;
drop policy if exists "authenticated full users" on public.users;
drop policy if exists "authenticated full registrations" on public.registrations;
drop policy if exists "authenticated full gallery" on public.gallery_images;
drop policy if exists "authenticated full announcements" on public.announcements;
drop policy if exists "authenticated full event settings" on public.event_settings;

-- Public routes
create policy "public read approved gallery"
on public.gallery_images
for select
using (status = 'approved');

create policy "public create pending gallery"
on public.gallery_images
for insert
to anon, authenticated
with check (status = 'pending');

create policy "public create registration"
on public.registrations
for insert
to anon, authenticated
with check (true);

create policy "public read announcements"
on public.announcements
for select
using (true);

create policy "public read event settings"
on public.event_settings
for select
using (true);

-- Admin app uses authenticated user access
create policy "authenticated full users"
on public.users
for all
to authenticated
using (true)
with check (true);

create policy "authenticated full registrations"
on public.registrations
for all
to authenticated
using (true)
with check (true);

create policy "authenticated full gallery"
on public.gallery_images
for all
to authenticated
using (true)
with check (true);

create policy "authenticated full announcements"
on public.announcements
for all
to authenticated
using (true)
with check (true);

create policy "authenticated full event settings"
on public.event_settings
for all
to authenticated
using (true)
with check (true);

-- ==========================
-- Storage bucket + policies
-- ==========================
insert into storage.buckets(id, name, public)
values ('reunion-images', 'reunion-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read reunion-images" on storage.objects;
drop policy if exists "Public upload reunion-images" on storage.objects;
drop policy if exists "Authenticated manage reunion-images" on storage.objects;

create policy "Public read reunion-images"
on storage.objects
for select
to public
using (bucket_id = 'reunion-images');

create policy "Public upload reunion-images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'reunion-images');

create policy "Authenticated manage reunion-images"
on storage.objects
for all
to authenticated
using (bucket_id = 'reunion-images')
with check (bucket_id = 'reunion-images');

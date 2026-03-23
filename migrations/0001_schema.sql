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

alter table public.registrations enable row level security;
alter table public.gallery_images enable row level security;
alter table public.announcements enable row level security;
alter table public.event_settings enable row level security;

-- Reset policies so this script can be re-run safely
DROP POLICY IF EXISTS "public can read approved gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "public can insert gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "public can register" ON public.registrations;
DROP POLICY IF EXISTS "public can read announcements" ON public.announcements;
DROP POLICY IF EXISTS "public can read event settings" ON public.event_settings;
DROP POLICY IF EXISTS "authenticated full gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "authenticated full registrations" ON public.registrations;
DROP POLICY IF EXISTS "authenticated full announcements" ON public.announcements;
DROP POLICY IF EXISTS "authenticated full event settings" ON public.event_settings;

-- Public flows
create policy "public can read approved gallery"
on public.gallery_images for select
using (status = 'approved');

create policy "public can insert gallery"
on public.gallery_images for insert
to anon, authenticated
with check (true);

create policy "public can register"
on public.registrations for insert
to anon, authenticated
with check (true);

create policy "public can read announcements"
on public.announcements for select
using (true);

create policy "public can read event settings"
on public.event_settings for select
using (true);

-- Admin dashboard operations are allowed to authenticated users.
-- Create only your admin account in Supabase Auth dashboard.
create policy "authenticated full gallery"
on public.gallery_images for all
to authenticated
using (true)
with check (true);

create policy "authenticated full registrations"
on public.registrations for all
to authenticated
using (true)
with check (true);

create policy "authenticated full announcements"
on public.announcements for all
to authenticated
using (true)
with check (true);

create policy "authenticated full event settings"
on public.event_settings for all
to authenticated
using (true)
with check (true);

-- Storage bucket and policies
insert into storage.buckets (id, name, public)
values ('reunion-images', 'reunion-images', true)
on conflict (id) do nothing;

DROP POLICY IF EXISTS "Public read reunion images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload reunion images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated manage reunion images" ON storage.objects;

create policy "Public read reunion images"
on storage.objects for select
to public
using (bucket_id = 'reunion-images');

create policy "Public upload reunion images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'reunion-images');

create policy "Authenticated manage reunion images"
on storage.objects for all
to authenticated
using (bucket_id = 'reunion-images')
with check (bucket_id = 'reunion-images');

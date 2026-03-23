# Reunion (Amla Government College Batch 2020) — Supabase Integrated

This project is now fully integrated with your Supabase project:
- **Project name:** Reunion
- **Project ID:** `tpksfvklhugfvocuyeci`
- **Project URL:** `https://tpksfvklhugfvocuyeci.supabase.co`

## Stack
- Next.js + Tailwind CSS
- Supabase Postgres (database)
- Supabase Auth (admin login)
- Supabase Storage (`reunion-images`) for photos
- GitHub Pages / Cloudflare Pages for frontend hosting

## 1) Local Setup

Copy env file:
```bash
cp .env.example .env.local
```

Then install/run:
```bash
npm install
npm run dev
```

> `lib/constants.ts` already contains fallback values for your provided Supabase URL + anon key, so app can run even without env vars.

## 2) Supabase Database + Storage Setup

Open Supabase SQL Editor and run:
- `migrations/0001_schema.sql` (existing migration)
- `sql/reunion_tables.sql` (ready-to-use full table script requested)

This will:
- create `registrations`, `gallery_images`, `announcements`, `event_settings`
- enable RLS policies
- create storage bucket `reunion-images` (if missing)
- add storage policies for public read/upload + authenticated management

## 3) Admin Login Setup

1. Supabase Dashboard → Authentication → Users
2. Create only your admin user (email/password)
3. Login from `/admin/login` with that email/password

> In this implementation, admin data mutations are allowed for **authenticated users**. So keep only trusted admin user accounts in Auth.

## 4) GitHub Pages Deployment

1. Repo Settings → Pages → Source = **GitHub Actions**
2. Repo Settings → Secrets and variables → Actions → Variables
3. Add these repository variables:
   - `NEXT_PUBLIC_SUPABASE_URL = https://tpksfvklhugfvocuyeci.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY = <your anon key>`
4. Push to `main`
5. Workflow `.github/workflows/deploy-github-pages.yml` will build and deploy `out/`

If github.io shows README instead of app, Pages source is not set to GitHub Actions.

## 5) Core Functional Flow

- **Register:** inserts into `registrations` + stores generated QR data URL
- **Memory Wall upload:** uploads image to Storage, inserts pending record into `gallery_images`
- **Public gallery:** only reads `status = approved`
- **Admin gallery:** approve/reject/delete image records
- **Announcements:** admin create + public read
- **Event settings:** admin save + public read
- **Registrations export:** CSV download from admin page

## Project Structure (important)

```txt
app/                 # public + admin UI
components/          # shared UI components
lib/                 # supabase client, app API layer, constants, types
migrations/          # Supabase SQL schema and policies
.github/workflows/   # GitHub Pages deployment workflow
workers/             # legacy files (not used in active runtime)
```

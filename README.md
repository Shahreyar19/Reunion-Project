# Amla Government College Batch 2020 Reunion Website (Supabase Edition)

A complete reunion platform built with **Next.js + Tailwind CSS** on the frontend and **Supabase (Postgres + Auth + Storage)** on backend services.

## Tech Stack
- Frontend: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Backend: Supabase (no custom Worker required)
- Database: Supabase Postgres
- Storage: Supabase Storage bucket (`reunion-images`)
- Authentication: Supabase Auth (admin email/password)
- Hosting: GitHub Pages (static export) or Cloudflare Pages

## Folder Structure
```txt
.
├── app/
│   ├── admin/
│   ├── contact/
│   ├── gallery/
│   ├── memory-wall/
│   ├── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── constants.ts
│   ├── supabase.ts
│   └── types.ts
├── migrations/
│   └── 0001_schema.sql
└── .github/workflows/deploy-github-pages.yml
```

## Features
- Hero banner + countdown timer
- Event details + schedule
- Reunion registration (QR code generated)
- Memory wall upload (image + caption)
- Gallery shows only `approved` images
- Admin login, dashboard, moderation, announcements, registrations CSV export, event settings

## Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

For GitHub Actions deployment, add repo variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Setup

### 1) Create project
- Go to https://supabase.com/dashboard
- Create new project

### 2) Run SQL schema
- Open SQL Editor in Supabase
- Run `migrations/0001_schema.sql`

### 3) Create storage bucket
- Storage → New bucket → name: `reunion-images`
- Set bucket to Public

### 4) Create admin user
- Authentication → Users → Add user
- Use admin email/password
- Add custom JWT claim `role=admin` (via auth hook/custom claims) or set equivalent role handling in your project.

## Local Development
```bash
npm install
npm run dev
```

## GitHub Pages Deployment
1. Settings → Pages → Source = GitHub Actions
2. Add repo variables listed above
3. Push to `main`
4. Workflow builds static `out/` and deploys

If you see README on `github.io`, your Pages source is wrong. Set it to **GitHub Actions**.

## Notes
- Old Cloudflare Worker files remain in `workers/` for reference, but active app flow now uses Supabase directly from `lib/api.ts`.

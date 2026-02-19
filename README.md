# Amla Government College Batch 2020 Reunion Website

Complete full-stack reunion platform built with **Next.js + Tailwind CSS** and **Cloudflare Workers + D1 + R2**.

## Tech Stack

- Frontend: Next.js 14 (App Router)
- Styling: Tailwind CSS
- API Backend: Cloudflare Workers
- Database: Cloudflare D1
- Storage: Cloudflare R2
- Auth: JWT for admin panel
- Hosting: Cloudflare Pages (frontend) + Workers (API)

## Project Structure

```txt
.
├── app/
│   ├── admin/
│   │   ├── announcements/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── login/page.tsx
│   │   ├── registrations/page.tsx
│   │   └── settings/page.tsx
│   ├── contact/page.tsx
│   ├── gallery/page.tsx
│   ├── memory-wall/page.tsx
│   ├── register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── migrations/
│   └── 0001_schema.sql
├── workers/
│   ├── src/index.ts
│   ├── package.json
│   └── wrangler.toml
└── README.md
```

## Features Implemented

### Public Website
- Hero banner + live countdown timer
- About batch section
- Event details with map embed
- Program timeline
- Registration form (name, phone, email, department, profession)
- Gallery page (approved images only)
- Memory Wall upload (caption + image)
- Contact/organizer cards

### Admin Panel
- JWT-based admin login
- Dashboard (stats cards UI)
- Moderation endpoints for gallery images
- Registrations export endpoint (CSV)
- Announcements posting endpoint
- Event info update endpoint

### Extra Features
- QR code generation during registration
- Email confirmation placeholder workflow (documented in API extension section)
- Premium navy/gold UI with responsive layout and smooth transitions

## Required API Routes (Workers)

- `POST /upload-image`
- `GET /get-gallery`
- `POST /approve-image`
- `POST /register`
- `POST /admin-login`

Additional admin routes:
- `POST /delete-image`
- `GET /admin/registrations`
- `GET /admin/export-csv`
- `POST /admin/announcement`
- `POST /admin/event-info`
- `GET /announcements`

## Database Schema (D1)

Run `migrations/0001_schema.sql`, which defines:
1. `users`
2. `registrations`
3. `gallery_images`
4. `announcements`
5. `event_settings`

## Local Development

### 1) Frontend
```bash
npm install
npm run dev
```

Set `.env.local`:
```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8787
```

### 2) Worker API
```bash
cd workers
npm install
npx wrangler dev
```

## Cloudflare Deployment Guide

### A) D1 Setup
```bash
npx wrangler d1 create agc_reunion
npx wrangler d1 execute agc_reunion --remote --file ../migrations/0001_schema.sql
```

Copy generated `database_id` into `workers/wrangler.toml`.

### B) R2 Setup
```bash
npx wrangler r2 bucket create agc-reunion-images
```

Enable public access (or custom domain) and set:
- `PUBLIC_R2_BASE` in `wrangler.toml` (e.g. `https://pub-xxxx.r2.dev`)

### C) Admin Credentials & JWT Secrets

1. Create a secure admin password.
2. Generate SHA-256 hash:
```bash
node -e "const crypto=require('crypto');console.log(crypto.createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
```
3. Set worker secrets:
```bash
cd workers
npx wrangler secret put JWT_SECRET
npx wrangler secret put ADMIN_PASSWORD_HASH
```
4. Set plain username in `wrangler.toml`:
```toml
[vars]
ADMIN_USERNAME = "admin"
```

### D) Deploy Worker
```bash
cd workers
npm run deploy
```

### E) Deploy Frontend to Cloudflare Pages

1. Push repo to GitHub.
2. Create Cloudflare Pages project and connect repository.
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add env var in Pages:
   - `NEXT_PUBLIC_API_BASE=https://<your-worker-subdomain>.workers.dev`
5. Deploy.

## Admin Credentials Setup Instructions

- Username is controlled by `ADMIN_USERNAME` variable.
- Password is never stored plain text; only SHA-256 hash goes into `ADMIN_PASSWORD_HASH` secret.
- Login endpoint validates username + hashed password and returns a signed JWT.
- Frontend stores JWT in local storage and includes it as bearer token for admin API calls.

## Production Hardening Checklist

- Replace localStorage auth with HTTP-only cookies.
- Add rate limiting on `/admin-login` and upload endpoints.
- Validate and compress images before upload.
- Add Turnstile CAPTCHA on public forms.
- Add transactional email provider for confirmation emails.
- Add audit logs for admin moderation actions.

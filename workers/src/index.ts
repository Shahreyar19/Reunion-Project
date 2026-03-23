import { SignJWT, jwtVerify } from 'jose';
import QRCode from 'qrcode';

export interface Env {
  DB: D1Database;
  IMAGE_BUCKET: R2Bucket;
  JWT_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH: string;
  PUBLIC_R2_BASE: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    }
  });

async function hashSHA256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createToken(username: string, secret: string) {
  return new SignJWT({ role: 'admin', username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(new TextEncoder().encode(secret));
}

async function ensureAdmin(req: Request, env: Env) {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) throw new Error('Unauthorized');
  await jwtVerify(auth.slice(7), new TextEncoder().encode(env.JWT_SECRET));
}

export default {
  async fetch(request, env): Promise<Response> {
    if (request.method === 'OPTIONS') return json({ ok: true });

    const { pathname } = new URL(request.url);

    try {
      if (pathname === '/admin-login' && request.method === 'POST') {
        const { username, password } = (await request.json()) as { username: string; password: string };
        const hash = await hashSHA256(password);
        if (username !== env.ADMIN_USERNAME || hash !== env.ADMIN_PASSWORD_HASH) {
          return json({ error: 'Invalid credentials' }, 401);
        }
        const token = await createToken(username, env.JWT_SECRET);
        return json({ token });
      }

      if (pathname === '/register' && request.method === 'POST') {
        const data = (await request.json()) as {
          name: string;
          phone: string;
          email: string;
          department: string;
          profession: string;
        };

        const result = await env.DB.prepare(
          `INSERT INTO registrations (name, phone, email, department, profession) VALUES (?, ?, ?, ?, ?)`
        )
          .bind(data.name, data.phone, data.email, data.department, data.profession)
          .run();

        const id = result.meta.last_row_id;
        const qrPayload = JSON.stringify({ id, name: data.name, email: data.email });
        const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

        await env.DB.prepare('UPDATE registrations SET qr_code_url = ? WHERE id = ?').bind(qrCodeDataUrl, id).run();

        return json({ success: true, qrCodeDataUrl });
      }

      if (pathname === '/upload-image' && request.method === 'POST') {
        const form = await request.formData();
        const image = form.get('image');
        const caption = String(form.get('caption') || 'Memory from AGC');
        if (!(image instanceof File)) return json({ error: 'Invalid image' }, 400);

        const key = `memories/${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
        await env.IMAGE_BUCKET.put(key, await image.arrayBuffer(), {
          httpMetadata: { contentType: image.type }
        });
        const url = `${env.PUBLIC_R2_BASE}/${key}`;

        await env.DB.prepare('INSERT INTO gallery_images (url, caption, status) VALUES (?, ?, ?)')
          .bind(url, caption, 'pending')
          .run();

        return json({ success: true, status: 'pending' });
      }

      if (pathname === '/get-gallery' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          "SELECT id, url, caption, status, created_at FROM gallery_images WHERE status = 'approved' ORDER BY created_at DESC"
        ).all();
        return json(results);
      }

      if (pathname === '/announcements' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
        return json(results);
      }

      if (pathname === '/approve-image' && request.method === 'POST') {
        await ensureAdmin(request, env);
        const { id, status } = (await request.json()) as { id: number; status: 'approved' | 'rejected' };
        await env.DB.prepare('UPDATE gallery_images SET status = ? WHERE id = ?').bind(status, id).run();
        return json({ success: true });
      }

      if (pathname === '/delete-image' && request.method === 'POST') {
        await ensureAdmin(request, env);
        const { id } = (await request.json()) as { id: number };
        const row = await env.DB.prepare('SELECT url FROM gallery_images WHERE id = ?').bind(id).first<{ url: string }>();
        if (row?.url) {
          const key = row.url.split('/').slice(-2).join('/');
          await env.IMAGE_BUCKET.delete(key);
        }
        await env.DB.prepare('DELETE FROM gallery_images WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      if (pathname === '/admin/registrations' && request.method === 'GET') {
        await ensureAdmin(request, env);
        const { results } = await env.DB.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
        return json(results);
      }

      if (pathname === '/admin/export-csv' && request.method === 'GET') {
        await ensureAdmin(request, env);
        const { results } = await env.DB.prepare(
          'SELECT name, phone, email, department, profession, created_at FROM registrations ORDER BY created_at DESC'
        ).all();

        const header = 'Name,Phone,Email,Department,Profession,Created At';
        const lines = results.map((r: any) => [r.name, r.phone, r.email, r.department, r.profession, r.created_at].map((v: string) => `"${String(v).replaceAll('"', '""')}"`).join(','));
        return new Response([header, ...lines].join('\n'), {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="registrations.csv"'
          }
        });
      }

      if (pathname === '/admin/announcement' && request.method === 'POST') {
        await ensureAdmin(request, env);
        const { title, message } = (await request.json()) as { title: string; message: string };
        await env.DB.prepare('INSERT INTO announcements (title, message) VALUES (?, ?)').bind(title, message).run();
        return json({ success: true });
      }

      if (pathname === '/admin/event-info' && request.method === 'POST') {
        await ensureAdmin(request, env);
        const { event_date, venue, map_embed_url, about } = (await request.json()) as Record<string, string>;
        await env.DB.prepare(
          'INSERT INTO event_settings (id, event_date, venue, map_embed_url, about) VALUES (1, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET event_date=excluded.event_date, venue=excluded.venue, map_embed_url=excluded.map_embed_url, about=excluded.about'
        )
          .bind(event_date, venue, map_embed_url, about)
          .run();
        return json({ success: true });
      }

      return json({ error: 'Not Found' }, 404);
    } catch (error) {
      return json({ error: (error as Error).message }, 500);
    }
  }
} satisfies ExportedHandler<Env>;

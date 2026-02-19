import { API_BASE } from '@/lib/constants';
import type { Announcement, GalleryImage, Registration } from '@/lib/types';

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

export async function getGallery(): Promise<GalleryImage[]> {
  return parseJson<GalleryImage[]>(await fetch(`${API_BASE}/get-gallery`, { cache: 'no-store' }));
}

export async function registerParticipant(payload: Registration) {
  return parseJson(await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }));
}

export async function uploadMemory(formData: FormData) {
  const response = await fetch(`${API_BASE}/upload-image`, { method: 'POST', body: formData });
  return parseJson(response);
}

export async function adminLogin(username: string, password: string) {
  return parseJson<{ token: string }>(await fetch(`${API_BASE}/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }));
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return parseJson<Announcement[]>(await fetch(`${API_BASE}/announcements`, { cache: 'no-store' }));
}

import QRCode from 'qrcode';
import { STORAGE_BUCKET } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import type { Announcement, GalleryImage, Registration } from '@/lib/types';

export async function getGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPendingGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function registerParticipant(payload: Registration) {
  const qrPayload = JSON.stringify({ name: payload.name, email: payload.email, phone: payload.phone });
  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);
  const { error } = await supabase.from('registrations').insert({ ...payload, qr_code_url: qrCodeDataUrl });
  if (error) throw error;
  return { success: true, qrCodeDataUrl };
}

export async function uploadMemory(formData: FormData) {
  const image = formData.get('image');
  const caption = String(formData.get('caption') || 'Memory from AGC');
  if (!(image instanceof File)) throw new Error('Invalid image');

  const fileName = `memories/${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
  const upload = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, image, { upsert: false });
  if (upload.error) throw upload.error;

  const { data: publicData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  const { error } = await supabase
    .from('gallery_images')
    .insert({ url: publicData.publicUrl, caption, status: 'pending' });
  if (error) throw error;

  return { success: true, status: 'pending' };
}

export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error('No session token');
  return { token };
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function postAnnouncement(title: string, message: string) {
  const { error } = await supabase.from('announcements').insert({ title, message });
  if (error) throw error;
}

export async function approveImage(id: number, status: 'approved' | 'rejected') {
  const { error } = await supabase.from('gallery_images').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteImage(id: number) {
  const { data, error } = await supabase.from('gallery_images').select('url').eq('id', id).single();
  if (error) throw error;
  const parts = data.url.split('/');
  const idx = parts.findIndex((p: string) => p === 'object');
  const key = idx > -1 ? parts.slice(idx + 2).join('/') : parts.slice(-2).join('/');
  await supabase.storage.from(STORAGE_BUCKET).remove([key]);
  const del = await supabase.from('gallery_images').delete().eq('id', id);
  if (del.error) throw del.error;
}

export async function getRegistrations() {
  const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function exportRegistrationsCsv() {
  const rows = await getRegistrations();
  const header = 'Name,Phone,Email,Department,Profession,Created At';
  const body = rows.map((r: any) => [r.name, r.phone, r.email, r.department, r.profession, r.created_at]
    .map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','));
  return [header, ...body].join('\n');
}


export async function getDashboardStats() {
  const [regs, gallery, anns] = await Promise.all([
    supabase.from('registrations').select('id', { count: 'exact', head: true }),
    supabase.from('gallery_images').select('id,status'),
    supabase.from('announcements').select('id', { count: 'exact', head: true })
  ]);

  const pending = (gallery.data || []).filter((x: any) => x.status === 'pending').length;
  const approved = (gallery.data || []).filter((x: any) => x.status === 'approved').length;

  return {
    registrations: regs.count || 0,
    pending,
    approved,
    announcements: anns.count || 0
  };
}

export async function saveEventInfo(payload: { event_date: string; venue: string; map_embed_url: string; about: string }) {
  const { error } = await supabase
    .from('event_settings')
    .upsert({ id: 1, ...payload });
  if (error) throw error;
}

export async function getEventInfo() {
  const { data, error } = await supabase.from('event_settings').select('*').eq('id', 1).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

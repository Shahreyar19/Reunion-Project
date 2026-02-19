'use client';

import { supabase } from '@/lib/supabase';

const TOKEN_KEY = 'agc_admin_token';

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  await supabase.auth.signOut();
}

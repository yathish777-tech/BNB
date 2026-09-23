// ── B&B Event Planners — Flask API client ─────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL ?? '/api';

export interface APICategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parallax_direction: 'ltr' | 'rtl';
  display_order: number;
}

export interface APIImage {
  id: number;
  category_id?: number;
  image_url: string;
  thumbnail_url: string;
  title: string;
  description: string;
  display_order: number;
  is_featured: boolean;
}

export interface EnquiryPayload {
  name: string;
  phone: string;
  email?: string;
  event_type: string;
  event_date?: string;
  location?: string;
  guest_count?: number;
  message: string;
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<APICategory[]> {
  try {
    const res = await fetch(`${BASE}/categories`);
    if (!res.ok) { console.warn(`[api] /categories → ${res.status}`); return []; }
    const data = await res.json();
    if (!data.success) return [];
    return data.categories as APICategory[];
  } catch (err) {
    console.warn('[api] fetchCategories failed (backend down?)', err);
    return [];
  }
}

export async function fetchFeaturedImage(slug: string): Promise<APIImage | null> {
  try {
    const res = await fetch(`${BASE}/categories/${slug}/featured`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return data.image as APIImage;
  } catch {
    return null;
  }
}

export async function fetchCategoryImages(slug: string): Promise<APIImage[]> {
  try {
    const res = await fetch(`${BASE}/categories/${slug}/images`);
    if (!res.ok) { console.warn(`[api] /${slug}/images → ${res.status}`); return []; }
    const data = await res.json();
    if (!data.success) return [];
    return data.images as APIImage[];
  } catch (err) {
    console.warn('[api] fetchCategoryImages failed (backend down?)', err);
    return [];
  }
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { success: false, message: `Server error ${res.status}` };
    return await res.json();
  } catch (err) {
    console.warn('[api] submitEnquiry failed', err);
    return { success: false, message: 'Could not reach server. Please try again.' };
  }
}

export interface InstagramMedia {
  id: string;
  media_type: 'VIDEO' | 'IMAGE' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  permalink: string;
  timestamp: string;
}

export async function fetchLatestInstagramMedia(): Promise<InstagramMedia[]> {
  try {
    const res = await fetch(`${BASE}/instagram/latest`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) return [];
    return data.data as InstagramMedia[];
  } catch (err) {
    console.error('Failed to fetch Instagram media:', err);
    return [];
  }
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
}

export async function adminLogout() {
  await fetch(`${BASE}/admin/auth/logout`, { method: 'POST', credentials: 'include' });
}

export async function adminMe() {
  const res = await fetch(`${BASE}/admin/auth/me`, { credentials: 'include' });
  return await res.json();
}

export async function adminGetCategories(): Promise<APICategory[]> {
  const res = await fetch(`${BASE}/admin/categories`, { credentials: 'include' });
  const data = await res.json();
  return data.success ? data.categories : [];
}

export async function adminAddCategory(name: string): Promise<boolean> {
  const res = await fetch(`${BASE}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  return data.success;
}

export async function adminDeleteCategory(id: number): Promise<boolean> {
  const res = await fetch(`${BASE}/admin/categories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await res.json();
  return data.success;
}

export async function adminGetImages(): Promise<APIImage[]> {
  const res = await fetch(`${BASE}/admin/images`, { credentials: 'include' });
  const data = await res.json();
  return data.success ? data.images : [];
}

export async function adminUploadImage(formData: FormData): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${BASE}/admin/images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  return await res.json();
}

export async function adminDeleteImage(id: number): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${BASE}/admin/images/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return await res.json();
}

export async function adminGetDashboardStats(): Promise<any> {
  const res = await fetch(`${BASE}/admin/dashboard/stats`, { credentials: 'include' });
  return await res.json();
}

export function getFullImageUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const clean = url.startsWith('/') ? url : `/${url}`;
  if (clean.startsWith('/api/')) return clean;
  return `${BASE}${clean}`;
}

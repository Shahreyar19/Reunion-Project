export type GalleryImage = {
  id: number;
  url: string;
  caption: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type Registration = {
  id?: number;
  name: string;
  phone: string;
  email: string;
  department: string;
  profession: string;
  qr_code_url?: string;
  created_at?: string;
};

export type Announcement = {
  id: number;
  title: string;
  message: string;
  created_at: string;
};

export type EventInfo = {
  event_date: string;
  venue: string;
  map_embed_url: string;
  about: string;
};

export type CreateEventBody = {
  eventName?: string;
  companyName?: string;
  category?: string;
  description?: string;
  date?: string;   // "YYYY-MM-DD"
  time?: string;   // "HH:mm"
  isOnline?: boolean;
  location?: string;
  isPopular?: boolean;
  capacity?: number;
  price?: number;
  hostId?: string; // for now
};

export type EventListItem = {
  id: string;
  name: string;
  date: string; // formatted string for UI table
  status: string;
  location?: string;
  attendeeCount?: number;
  code?: string;
  qrData?: string;
  hostId?: string;
  companyName?: string;
  category?: string;
  description?: string;
  isOnline?: boolean;
  capacity?: number;
  price?: number;
};
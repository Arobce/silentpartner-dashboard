// Convert Firestore Timestamp/Date to JS Date safely
export function toDate(value: any): Date | null {
  if (!value) return null;

  if (typeof value?.toDate === "function") return value.toDate();

  if (value instanceof Date) return value;

  const d = new Date(value);
  
  return isNaN(d.getTime()) ? null : d;
}

export function formatForTable(d: Date): string {
  // Example: "Feb 20, 2026 6:30 PM"
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}


export function makeEventCode(name: string) {
  // simple readable code (not guaranteed unique)
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 12);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base || "EVENT"}${suffix}`;
}


export function makeJoinUrl(code: string) {
  // Generate a join URL for the event
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/events/${code}/join`;
}

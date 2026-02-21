import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { CreateEventBody, EventListItem } from "@/types/api";
import { formatForTable, makeEventCode, makeJoinUrl, toDate } from "@/app/utils/api/event-utils";



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hostId = searchParams.get("hostId")?.trim() || null;

    const baseRef = collection(db, "events");

    // Get all events first (no composite index needed)
    const q = query(baseRef, orderBy("date", "desc"));
    const snap = await getDocs(q);

    // Filter by hostId in code if provided
    const allDocs = snap.docs.filter(doc => {
      if (!hostId) return true;
      return doc.data().hostId === hostId;
    });

    const events: EventListItem[] = allDocs.map((doc) => {
      const data = doc.data() as any;
      const d = toDate(data.date);

      return {
        id: doc.id,
        name: String(data.name ?? ""),
        date: d ? formatForTable(d) : "",
        status: String(data.status ?? "live"),
        location: data.location,
        attendeeCount: data.attendeeCount ?? 0,
        code: data.code,
        qrData: data.qrData,
        hostId: data.hostId,
        companyName: data.companyName,
        category: data.category,
        description: data.description,
        isOnline: data.isOnline,
        capacity: data.capacity,
        isPopular: data.isPopular,
        price: data.price,
      };
    });

    return NextResponse.json({ ok: true, events });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateEventBody;

    const eventName = String(body.eventName ?? "").trim();
    const companyName = String(body.companyName ?? "").trim();
    const category = String(body.category ?? "").trim();
    const description = String(body.description ?? "").trim();
    const location = String(body.location ?? "").trim();
    const isOnline = Boolean(body.isOnline);
    const hostId = String(body.hostId ?? "").trim();
    
    const isPopular = Boolean(body.isPopular);

    const capacity = Number.isFinite(body.capacity) ? Number(body.capacity) : 0;
    const price = Number.isFinite(body.price) ? Number(body.price) : 0;

    if (!eventName) return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    if (!companyName) return NextResponse.json({ error: "companyName is required" }, { status: 400 });
    if (!category) return NextResponse.json({ error: "category is required" }, { status: 400 });
    if (!description) return NextResponse.json({ error: "description is required" }, { status: 400 });
    if (!location) return NextResponse.json({ error: "location is required" }, { status: 400 });
    if (!hostId) return NextResponse.json({ error: "hostId is required" }, { status: 400 });

    if (!Number.isInteger(capacity) || capacity < 1) {
      return NextResponse.json({ error: "capacity must be >= 1" }, { status: 400 });
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });
    }

    // Combine date + time into one ISO timestamp
    const dateStr = String(body.date ?? "").trim(); // YYYY-MM-DD
    const timeStr = String(body.time ?? "").trim(); // HH:mm
    if (!dateStr) return NextResponse.json({ error: "date is required" }, { status: 400 });
    if (!timeStr) return NextResponse.json({ error: "time is required" }, { status: 400 });

    // Local time -> Date
    const startsAt = new Date(`${dateStr}T${timeStr}:00`);
    if (isNaN(startsAt.getTime())) {
      return NextResponse.json({ error: "Invalid date/time" }, { status: 400 });
    }

    const code = makeEventCode(eventName);
    const qrData = makeJoinUrl(code);

    const speakers = Array.isArray(body.speakers)
      ? body.speakers
          .filter((s: { name?: string }) => s?.name?.trim())
          .map((s: { name?: string; title?: string }) => ({
            name: String(s.name ?? "").trim(),
            title: String(s.title ?? "").trim(),
          }))
      : [];

    const docRef = await addDoc(collection(db, "events"), {
      name: eventName,
      code,
      qrData,
      date: startsAt,
      location,
      attendeeCount: 0,

      // Extra fields
      companyName,
      category,
      description,
      isOnline,
      capacity,
      isPopular,
      price,
      speakers,

      // Ownership
      hostId,

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ ok: true, eventId: docRef.id, code, qrData });
  } catch (e: any) {
    console.error("POST /api/events error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}


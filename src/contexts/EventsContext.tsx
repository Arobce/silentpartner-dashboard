"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { EventItem } from "@/components/EventList";
import type { EventSubmitPayload } from "@/components/EventCreationForm";

interface EventsContextValue {
  events: EventItem[];
  addEvent: (payload: EventSubmitPayload) => void;
}

const EventsContext = createContext<EventsContextValue | null>(null);

let nextId = 1;

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);

  const addEvent = useCallback((payload: EventSubmitPayload) => {
    let dateDisplay: string;
    if (payload.isMultiDay && payload.startDate && payload.endDate) {
      dateDisplay = `${payload.startDate} – ${payload.endDate}`;
    } else if (payload.startDate && payload.time) {
      dateDisplay = `${payload.startDate} ${payload.time}`;
    } else {
      dateDisplay = payload.startDate || "";
    }
    setEvents((prev) => [
      ...prev,
      {
        id: nextId++,
        name: payload.eventName,
        date: dateDisplay,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isMultiDay: payload.isMultiDay,
        status: "Draft",
      },
    ]);
  }, []);

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error("useEvents must be used within EventsProvider");
  }
  return ctx;
}

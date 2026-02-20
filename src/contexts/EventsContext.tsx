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
    const dateDisplay =
      payload.date && payload.time
        ? `${payload.date} ${payload.time}`
        : payload.date || "";
    setEvents((prev) => [
      ...prev,
      {
        id: nextId++,
        name: payload.eventName,
        date: dateDisplay,
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

"use client";

import React from "react";
import { AttendeesList } from "@/components/AttendeesList";
import { useEvents } from "@/contexts/EventsContext";

export default function AttendeesPage() {
  const { events } = useEvents();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-semibold text-dark-gray">Attendees</h1>
      <AttendeesList events={events} />
    </div>
  );
}

"use client";

import React from "react";
import { EventList } from "@/components/EventList";
import { useEvents } from "@/contexts/EventsContext";
import { CreateEventButton } from "@/components/CreateEventButton";

export default function MyEventsPage() {
  const { events } = useEvents();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-dark-gray">My Events</h1>
        <CreateEventButton />
      </div>

      <div className="mt-6">
        <EventList
          events={events}
          onViewDetails={(event) => console.log("View details:", event)}
        />
      </div>
    </div>
  );
}

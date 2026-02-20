"use client";

import React from "react";
import { EventList } from "@/components/EventList";
import { EventDetailsModal } from "@/components/EventDetailsModal";
import { CreateEventButton } from "@/components/CreateEventButton";
import type { EventItem } from "@/components/EventList";

export default function MyEventsPage() {
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events?hostId=test-user-id");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleViewDetails = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-dark-gray">My Events</h1>
        <CreateEventButton />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-xl border border-border bg-white p-12 text-center">
            <p className="text-medium-gray">Loading events...</p>
          </div>
        ) : (
          <EventList
            events={events}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

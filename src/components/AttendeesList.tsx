"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { EventItem } from "@/components/EventList";

export interface Attendee {
  id: number;
  name: string;
  email: string;
  ticketType: string;
  status: "Checked In" | "Pending";
}

const attendees: Attendee[] = [];

interface AttendeesListProps {
  events: EventItem[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatusBadge({ status }: { status: Attendee["status"] }) {
  const isCheckedIn = status === "Checked In";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isCheckedIn
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {status}
    </span>
  );
}

export function AttendeesList({ events }: AttendeesListProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAttendees = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return attendees;
    return attendees.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
          {/* Event Filter */}
          <div className="min-w-[200px]">
            <label htmlFor="event-filter" className="sr-only">
              Select event
            </label>
            <select
              id="event-filter"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All events</option>
              {events.map((event) => (
                <option key={event.id} value={String(event.id)}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-gray" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-dark-gray placeholder:text-medium-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[calc(100vh-280px)] overflow-auto">
          <table className="w-full min-w-[600px]">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Ticket Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm text-medium-gray"
                  >
                    {searchQuery.trim()
                      ? "No attendees match your search."
                      : "No attendees yet."}
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((attendee) => (
                  <tr
                    key={attendee.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {getInitials(attendee.name)}
                        </div>
                        <span className="font-medium text-dark-gray">
                          {attendee.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-medium-gray">
                      {attendee.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-gray">
                      {attendee.ticketType}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={attendee.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

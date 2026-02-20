"use client";

import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
} from "lucide-react";
import { EventList } from "@/components/EventList";
import { CreateEventButton } from "@/components/CreateEventButton";
import { useEvents } from "@/contexts/EventsContext";

const stats = [
  { label: "Total Events", value: "0", icon: Calendar },
  { label: "Total Signups", value: "0", icon: Users },
  { label: "Revenue", value: "$0", icon: LayoutDashboard },
];

export default function DashboardPage() {
  const { events } = useEvents();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Top Stats Bar */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-medium-gray">
                {stat.label}
              </span>
              <stat.icon className="h-5 w-5 text-medium-gray" />
            </div>
            <p className="mt-2 text-2xl font-bold text-dark-gray">
              {stat.label === "Total Events" ? events.length : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-dark-gray">
            Recent Events
          </h2>
          <CreateEventButton />
        </div>

        <EventList
          events={events}
          onViewDetails={(event) => console.log("View details:", event)}
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
} from "lucide-react";
import { CreateEventButton } from "@/components/CreateEventButton";

interface RecentEvent {
  id: string;
  name: string;
  date: string;
  status: string;
}

export default function DashboardPage() {
  const [recentEvents, setRecentEvents] = React.useState<RecentEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events?hostId=test-user-id");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setRecentEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setRecentEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Top Stats Bar */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Events", value: recentEvents.length, icon: Calendar },
          { label: "Total Signups", value: "0", icon: Users },
          { label: "Revenue", value: "$0", icon: LayoutDashboard },
        ].map((stat) => (
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
              {stat.value}
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

        {/* Recent Events Table */}
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-125">
              <thead>
                <tr className="border-b border-border bg-gray">
                  <th className="px-6 py-4 text-left text-sm font-medium text-medium-gray">
                    Event Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-medium-gray">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-medium-gray">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-medium-gray"
                    >
                      Loading events...
                    </td>
                  </tr>
                ) : recentEvents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-medium-gray"
                    >
                      No events yet. Create your first event to get started.
                    </td>
                  </tr>
                ) : (
                  recentEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="transition-colors hover:bg-gray"
                    >
                      <td className="px-6 py-4 font-medium text-dark-gray">
                        {event.name}
                      </td>
                      <td className="px-6 py-4 text-medium-gray">
                        {event.date}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={event.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const styles: Record<string, string> = {
    live: "bg-success-light text-success",
    draft: "bg-light-gray text-medium-gray",
    ended: "bg-light-gray text-medium-gray",
  };
  const style = styles[status] ?? "bg-light-gray text-medium-gray";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

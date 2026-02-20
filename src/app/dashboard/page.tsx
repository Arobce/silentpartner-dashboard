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

            {/* Recent Events Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
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
                    {recentEvents.length === 0 ? (
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
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Live: "bg-success-light text-success",
    Draft: "bg-light-gray text-medium-gray",
    Ended: "bg-light-gray text-medium-gray",
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

function CreateEventButton() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        <Plus className="h-4 w-4" />
        Create Event
      </button>

      {isModalOpen && (
        <CreateEventModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

function CreateEventModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-gray/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between">
          <h3 id="modal-title" className="text-lg font-semibold text-dark-gray">
            Create Event
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-medium-gray transition-colors hover:bg-light-gray hover:text-dark-gray"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <EventCreationForm
          onSubmit={() => onClose()}
          onCancel={() => onClose()}
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { X, MapPin, Users, DollarSign, Tag, Building2, Globe, Mic2 } from "lucide-react";
import type { EventItem } from "./EventList";

interface EventDetailsModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
}: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-light-gray"
          type="button"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-medium-gray" />
        </button>

        {/* Header Section */}
        <div className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent p-6 pr-12">
          <h2 className="text-2xl font-bold text-dark-gray">{event.name}</h2>
          {event.companyName && (
            <p className="mt-1 flex items-center gap-2 text-medium-gray">
              <Building2 className="h-4 w-4" />
              {event.companyName}
            </p>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">

          {/* Main Grid */}
          <div className="space-y-6">
            {/* Date and Time Information */}
            {(event.date || event.startDate || event.endDate) && (
              <div className="rounded-lg border border-border bg-light-gray/30 p-4">
                <h3 className="mb-3 font-semibold text-dark-gray">Date & Time</h3>
                <div className="space-y-2">
                  {event.date && (
                    <p className="text-sm text-medium-gray">
                      <span className="font-medium text-dark-gray">Display Date: </span>
                      {event.date}
                    </p>
                  )}
                  {event.startDate && (
                    <p className="text-sm text-medium-gray">
                      <span className="font-medium text-dark-gray">Start Date: </span>
                      {event.startDate}
                    </p>
                  )}
                  {event.endDate && (
                    <p className="text-sm text-medium-gray">
                      <span className="font-medium text-dark-gray">End Date: </span>
                      {event.endDate}
                    </p>
                  )}
                  {event.isMultiDay && (
                    <p className="text-sm text-primary">
                      ✓ Multi-day Event
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Event Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Category */}
              {event.category && (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-medium-gray">Category</p>
                      <p className="mt-1 font-medium text-dark-gray">{event.category}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              {event.location && (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-medium-gray">Location</p>
                      <p className="mt-1 font-medium text-dark-gray">{event.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Capacity */}
              {event.capacity !== undefined && (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-medium-gray">Capacity</p>
                      <p className="mt-1 font-medium text-dark-gray">{event.capacity} people</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              {event.price !== undefined && (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-medium-gray">Price</p>
                      <p className="mt-1 font-medium text-dark-gray">
                        {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Type */}
              {event.isOnline !== undefined && (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-medium-gray">Format</p>
                      <p className="mt-1 font-medium text-dark-gray">
                        {event.isOnline ? "Online" : "In-Person"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="rounded-lg border border-border bg-light-gray/30 p-4">
                <h3 className="mb-3 font-semibold text-dark-gray flex items-center gap-2">
                  <Mic2 className="h-4 w-4 text-primary" />
                  Speakers / Hosts
                </h3>
                <ul className="space-y-2">
                  {event.speakers.map((speaker, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2"
                    >
                      <span className="font-medium text-dark-gray">
                        {speaker.name || "Unnamed speaker"}
                      </span>
                      {speaker.title && (
                        <span className="text-sm text-medium-gray">
                          {speaker.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="rounded-lg border border-border bg-light-gray/30 p-4">
                <h3 className="mb-2 font-semibold text-dark-gray">Description</h3>
                <p className="text-sm text-medium-gray whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {/* Event Code and QR Data */}
            {(event.code || event.qrData) && (
              <div className="rounded-lg border border-border bg-light-gray/30 p-4">
                <h3 className="mb-3 font-semibold text-dark-gray">Event Access</h3>
                <div className="space-y-2">
                  {event.code && (
                    <p className="text-sm text-medium-gray">
                      <span className="font-medium text-dark-gray">Event Code: </span>
                      <code className="rounded bg-white px-2 py-1 font-mono text-primary">
                        {event.code}
                      </code>
                    </p>
                  )}
                  {event.qrData && (
                    <p className="text-sm text-medium-gray">
                      <span className="font-medium text-dark-gray">Join URL: </span>
                      <code className="break-all rounded bg-white px-2 py-1 font-mono text-xs">
                        {event.qrData}
                      </code>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-medium-gray">
                <span className="font-medium">Event ID: </span>
                {event.id}
              </p>
              {event.hostId && (
                <p className="mt-1 text-xs text-medium-gray">
                  <span className="font-medium">Host ID: </span>
                  {event.hostId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-light-gray/30 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-border px-4 py-2 font-medium text-dark-gray transition-colors hover:bg-light-gray"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

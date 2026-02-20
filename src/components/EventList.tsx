"use client";

import React, { useRef } from "react";
import { Eye, Download } from "lucide-react";

const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code/";

// Use qrcode.react if available, otherwise fall back to API
let QRCodeSVG: React.ComponentType<{ value: string; size?: number }> | null =
  null;
let QRCodeCanvas: React.ComponentType<{
  value: string;
  size?: number;
  ref?: React.Ref<HTMLCanvasElement>;
}> | null = null;
try {
  const qr = require("qrcode.react");
  QRCodeSVG = qr.QRCodeSVG;
  QRCodeCanvas = qr.QRCodeCanvas;
} catch {
  // qrcode.react not installed - will use API fallback
}

export interface EventItem {
  id: number;
  name: string;
  date: string;
  startDate?: string;
  endDate?: string;
  isMultiDay?: boolean;
  status?: string;
}

interface EventListProps {
  events: EventItem[];
  onViewDetails?: (event: EventItem) => void;
}

function getQRCodeUrl(data: string, size = 80): string {
  return `${QR_API_BASE}?data=${encodeURIComponent(data)}&size=${size}x${size}`;
}

function getEventDayCount(startDate?: string, endDate?: string): number | null {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return null;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end day
}

function EventCard({
  event,
  onViewDetails,
}: {
  event: EventItem;
  onViewDetails?: (event: EventItem) => void;
}) {
  const qrData = `${event.name}|#${event.id}`;
  const qrPreviewUrl = getQRCodeUrl(qrData, 80);
  const qrDownloadUrl = getQRCodeUrl(qrData, 256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownloadQR = async () => {
    if (QRCodeCanvas && canvasRef.current) {
      try {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `event-${event.id}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      } catch {
        // Fall through to API fallback
      }
    }

    // API fallback
    try {
      const res = await fetch(qrDownloadUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `event-${event.id}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrDownloadUrl, "_blank");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* QR Code Preview - Top Right Corner */}
      <div className="absolute right-4 top-4">
        {QRCodeSVG ? (
          <div className="rounded-lg border border-border bg-white p-1">
            <QRCodeSVG value={qrData} size={64} />
          </div>
        ) : (
          <img
            src={qrPreviewUrl}
            alt={`QR code for ${event.name}`}
            className="h-16 w-16 rounded-lg border border-border bg-white p-1"
            width={64}
            height={64}
          />
        )}
      </div>

      {/* Hidden canvas for download (when using qrcode.react) */}
      {QRCodeCanvas && (
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <QRCodeCanvas
            ref={canvasRef}
            value={qrData}
            size={256}
          />
        </div>
      )}

      {/* Content */}
      <div className="pr-20">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-primary">#{event.id}</p>
          {event.isMultiDay &&
            event.startDate &&
            event.endDate &&
            getEventDayCount(event.startDate, event.endDate) !== null && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {getEventDayCount(event.startDate, event.endDate)} Day Event
              </span>
            )}
        </div>
        <h3 className="mt-1 text-lg font-semibold text-dark-gray line-clamp-2">
          {event.name}
        </h3>
        <p className="mt-1 text-sm text-medium-gray">{event.date}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onViewDetails?.(event)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-dark-gray transition-colors hover:bg-light-gray"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
        <button
          type="button"
          onClick={handleDownloadQR}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Download className="h-4 w-4" />
          Download QR
        </button>
      </div>
    </div>
  );
}

export function EventList({ events, onViewDetails }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-12 text-center">
        <p className="text-medium-gray">
          No events yet. Create your first event to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

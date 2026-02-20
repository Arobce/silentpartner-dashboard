"use client";

import React, { useState } from "react";

const EVENT_CATEGORIES = [
  "Hackathon",
  "Workshop",
  "Meetup",
  "Conference",
  "Networking",
  "Other",
];

export interface EventFormData {
  eventName: string;
  organizationName: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  isMultiDay: boolean;
  isOnline: boolean;
  location: string;
  capacity: string;
  price: string;
}

const initialFormData: EventFormData = {
  eventName: "",
  organizationName: "",
  category: "",
  description: "",
  startDate: "",
  endDate: "",
  time: "",
  isMultiDay: false,
  isOnline: false,
  location: "",
  capacity: "",
  price: "0",
};

export type EventSubmitPayload = Omit<EventFormData, "capacity" | "price"> & {
  capacity: number;
  price: number;
};

interface EventCreationFormProps {
  readonly onSubmit?: (data: EventSubmitPayload) => void;
  readonly onCancel?: () => void;
  readonly hostId: string;
}

export function EventCreationForm({ onSubmit, onCancel, hostId }: EventCreationFormProps) {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let newValue: string | boolean = value;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "isMultiDay" && !checked) {
      setFormData((prev) => ({ ...prev, endDate: "" }));
    }
    setDateError("");
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload: EventSubmitPayload = {
      ...formData,
      capacity: formData.capacity ? Number(formData.capacity) : 0,
      price: formData.price ? Number(formData.price) : 0,
    };

    setIsLoading(true);
    try {
      // Transform form data to match API expectations
      const apiPayload = {
        eventName: payload.eventName,
        companyName: payload.organizationName,
        category: payload.category,
        description: payload.description,
        date: payload.startDate, // Use startDate as the main date
        time: payload.time,
        isOnline: payload.isOnline,
        location: payload.location,
        capacity: payload.capacity,
        price: payload.price,
        hostId,
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create event");
      }

      const data = await response.json();
      console.log("Event created successfully:", data);
      
      // Reset form
      setFormData(initialFormData);
      
      // Reload page to show the new event
      window.location.reload();
      
      // Call onSubmit callback
      onSubmit?.(payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Error creating event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="eventName"
            className="mb-1 block text-sm text-medium-gray"
          >
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. 24hr Hackathon 2025"
          />
        </div>
        <div>
          <label
            htmlFor="organizationName"
            className="mb-1 block text-sm text-medium-gray"
          >
            Organization Name
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Acme Inc."
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm text-medium-gray"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select category</option>
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm text-medium-gray"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Describe your event..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-medium-gray">
            <input
              type="checkbox"
              name="isMultiDay"
              checked={formData.isMultiDay}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Multi-day event
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="mb-1 block text-sm text-medium-gray"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {formData.isMultiDay ? (
            <div>
              <label
                htmlFor="endDate"
                className="mb-1 block text-sm text-medium-gray"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate || undefined}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="time"
                className="mb-1 block text-sm text-medium-gray"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
        {formData.isMultiDay && (
          <div>
            <label
              htmlFor="time"
              className="mb-1 block text-sm text-medium-gray"
            >
              Start Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full max-w-50 rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}
        {dateError && (
          <p className="text-sm text-error" role="alert">{dateError}</p>
        )}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-medium-gray">
            <input
              type="checkbox"
              name="isOnline"
              checked={formData.isOnline}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Online / Virtual
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={
              formData.isOnline ? "e.g. Zoom, Google Meet link" : "Venue address"
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="capacity"
              className="mb-1 block text-sm text-medium-gray"
            >
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min={1}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="0"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="mb-1 block text-sm text-medium-gray"
            >
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min={0}
              step={0.01}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark-gray focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="0"
            />
          </div>
        </div>
        {Number(formData.price) === 0 && (
          <p className="text-xs text-medium-gray">0 = Free event</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-dark-gray transition-colors hover:bg-light-gray disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}

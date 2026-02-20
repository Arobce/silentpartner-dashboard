"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { EventCreationForm } from "@/components/EventCreationForm";
import type { EventSubmitPayload } from "@/components/EventCreationForm";

export function CreateEventButton() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClose = () => setIsModalOpen(false);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-dark-gray/50"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between">
              <h3
                id="modal-title"
                className="text-lg font-semibold text-dark-gray"
              >
                Create Event
              </h3>
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-medium-gray transition-colors hover:bg-light-gray hover:text-dark-gray"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <EventCreationForm
              hostId="test-user-id"
              onCancel={handleClose}
            />
          </div>
        </div>
      )}
    </>
  );
}

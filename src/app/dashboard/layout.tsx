"use client";

import { EventsProvider } from "@/contexts/EventsContext";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EventsProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </EventsProvider>
  );
}

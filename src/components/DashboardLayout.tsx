"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "My Events", icon: Calendar },
  { href: "/dashboard/attendees", label: "Attendees", icon: Users },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray md:flex-row">
      {/* Sidebar - hidden on mobile, shown on md+ */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-white md:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-xl font-semibold text-dark-gray">
            Silent Partner
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-medium-gray transition-colors hover:bg-light-gray hover:text-dark-gray data-[active]:bg-light-gray data-[active]:text-dark-gray"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile header nav */}
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:hidden">
        <span className="text-lg font-semibold text-dark-gray">
          Silent Partner
        </span>
        <nav className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg p-2 text-medium-gray hover:bg-light-gray"
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 md:pl-64">{children}</main>
    </div>
  );
}

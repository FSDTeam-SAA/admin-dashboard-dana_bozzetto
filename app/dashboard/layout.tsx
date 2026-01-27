"use client";

import React from "react"

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>

          <Toaster position="top-right" richColors />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}

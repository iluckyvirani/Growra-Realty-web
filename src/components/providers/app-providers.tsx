"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BuyerDataSync } from "@/components/providers/buyer-data-sync";
import { PortalMessagingSync } from "@/components/providers/portal-messaging-sync";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <BuyerDataSync />
      <PortalMessagingSync />
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: "rounded-2xl border border-border shadow-lg",
        }}
      />
    </ThemeProvider>
  );
}

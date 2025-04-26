"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { SubscriptionProvider } from "@/contexts/subscription-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SubscriptionProvider>
        {children}
      </SubscriptionProvider>
    </ThemeProvider>
  )
}

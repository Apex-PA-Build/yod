import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { CartSync } from "@/features/cart";
import { Toaster } from "@/components/ui/toaster";
import { ConvexClientProvider } from "./convex-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ConvexClientProvider>
        <NuqsAdapter>
          {children}
          <CartSync />
          <Toaster />
        </NuqsAdapter>
      </ConvexClientProvider>
    </ThemeProvider>
  );
}

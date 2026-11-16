"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ============================================================
// QUERY CLIENT FACTORY
// ============================================================

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection)
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// ============================================================
// PROVIDER COMPONENT
// ============================================================

export interface ReactQueryProviderProps {
  children: ReactNode;
}

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  // have a suspense boundary between this and the code that may
  // suspend because React will throw away the client on the initial
  // render if it suspends and there is no boundary
  const [queryClient] = useState(() => getQueryClient());

  // Suppress harmless React DevTools extension bridge shutdown errors during route transitions
  useEffect(() => {
    const isBridgeError = (msg?: string) =>
      typeof msg === "string" &&
      msg.includes("Cannot send a message through a Bridge that has been shut down");

    const handleError = (event: ErrorEvent) => {
      const msg = event?.message || event?.error?.message;
      const file = event?.filename || "";
      if (isBridgeError(msg) || file.includes("react_devtools_backend")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reasonMsg = event?.reason?.message || String(event?.reason || "");
      if (isBridgeError(reasonMsg)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleRejection, true);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection, true);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

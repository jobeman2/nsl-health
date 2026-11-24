import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Standard QueryClient configuration for mobile enforcement workflows.
 * Sets 1-minute stale time and disables automatic background refetch on reconnect spam.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * React Query Provider component wrapping the app tree.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

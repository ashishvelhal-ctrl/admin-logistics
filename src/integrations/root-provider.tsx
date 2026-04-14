import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { QueryClientConfig } from "@tanstack/react-query";

export function getContext() {
  const queryConfig: QueryClientConfig = {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes default for all queries
        gcTime: 1000 * 60 * 10, // 10 minutes default cache time (renamed from cacheTime)
        refetchOnWindowFocus: import.meta.env.PROD,
        refetchOnReconnect: true,
        refetchOnMount: false,
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors or network errors
          const status = Number(error?.status ?? error?.response?.status);
          if (status >= 400 && status < 500) {
            return false;
          }
          if (error?.code === "NETWORK_ERROR") {
            return false;
          }
          return failureCount < 1;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Add error boundary integration
        throwOnError: false,
      },
      mutations: {
        retry: false,
        onError: (error) => {
          // Global mutation error handling can be added here
          console.error("Mutation error:", error);
        },
        // Add optimistic update defaults
        onMutate: undefined,
        onSettled: undefined,
      },
    },
  };

  const queryClient = new QueryClient(queryConfig);

  return {
    queryClient,
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

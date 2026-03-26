import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import * as TanstackQuery from "./integrations/root-provider";
import { routeTree } from "./routeTree.gen";

import { ToastContainer } from "@/components/ui/toast";

interface RouterContext {
  queryClient: ReturnType<typeof TanstackQuery.getContext>["queryClient"];
}

// Create a proper error boundary component
const ErrorBoundary = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-600 mb-4 text-sm">{error.message}</p>
      <details className="text-left text-xs text-gray-500 mb-4">
        <summary className="cursor-pointer mb-2">Error details</summary>
        <pre className="bg-gray-100 p-2 rounded overflow-auto">
          {error.stack}
        </pre>
      </details>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext } as RouterContext,
    defaultPreload: "intent",
    defaultErrorComponent: ErrorBoundary,
    defaultPendingComponent: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          <ToastContainer />
          {props.children}
        </TanstackQuery.Provider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};

import type { ReactNode } from "react";

import * as TanstackQuery from "./integrations/root-provider";

import { ToastContainer } from "@/components/ui/toast";

export function RouterErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Something went wrong
        </h1>
        <p className="mb-4 text-sm text-gray-600">{error.message}</p>
        <details className="mb-4 text-left text-xs text-gray-500">
          <summary className="mb-2 cursor-pointer">Error details</summary>
          <pre className="overflow-auto rounded bg-gray-100 p-2">
            {error.stack}
          </pre>
        </details>
        <button
          onClick={reset}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export function RouterPendingComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>
  );
}

export function RouterWrap({
  children,
  context,
}: {
  children: ReactNode;
  context: ReturnType<typeof TanstackQuery.getContext>;
}) {
  return (
    <TanstackQuery.Provider {...context}>
      <ToastContainer />
      {children}
    </TanstackQuery.Provider>
  );
}

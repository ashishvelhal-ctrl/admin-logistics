// import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import cropnestLogo from "../assets/Cropnest_logo.png";
// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from "../styles.css?url";

import { ROUTE_TITLES } from "./auth/-consts";

import type { QueryClient } from "@tanstack/react-query";

import { ToastContainer } from "@/components/ui/toast";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: ({ matches }) => {
    const activePath = matches[matches.length - 1]?.fullPath ?? "";
    const title = ROUTE_TITLES[activePath] ?? "Cropnest";

    return {
      meta: [
        {
          title,
        },
      ],
      links: [
        {
          rel: "icon",
          type: "image/png",
          href: cropnestLogo,
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">Page not found</p>
        <a
          href="/auth/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <ToastContainer />
        {/* <TanStackDevtools
          config={{
            position: 'bottom-right',
            defaultOpen: true,
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  );
}

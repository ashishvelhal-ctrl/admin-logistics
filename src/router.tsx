import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import * as TanstackQuery from "./integrations/root-provider";
import { routeTree } from "./routeTree.gen";
import {
  RouterErrorBoundary,
  RouterPendingComponent,
  RouterWrap,
} from "./router-components";
import type { ReactNode } from "react";

interface RouterContext {
  queryClient: ReturnType<typeof TanstackQuery.getContext>["queryClient"];
}

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    context: { ...rqContext } as RouterContext,
    defaultPreload: "intent",
    defaultErrorComponent: RouterErrorBoundary,
    defaultPendingComponent: RouterPendingComponent,
    Wrap: (props: { children: ReactNode }) => {
      return RouterWrap({ context: rqContext, children: props.children });
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};

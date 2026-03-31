import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Layout } from "@/components/layout/Layout";

export const Route = createFileRoute("/(promoter)")({
  component: PromoterLayoutRoute,
});

function PromoterLayoutRoute() {
  return (
    <Layout variant="promoter">
      <Outlet />
    </Layout>
  );
}

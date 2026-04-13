import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtom } from "jotai";

import { Layout } from "@/components/layout/Layout";
import { authAtom } from "@/atoms/authAtom";
import { ADMIN_ROLES } from "../guards/-requireRoles";

export const Route = createFileRoute("/(promoter)")({
  component: PromoterLayoutRoute,
});

function PromoterLayoutRoute() {
  const [authState] = useAtom(authAtom);

  // Check if user has admin role to use admin layout
  const hasAdminRole = authState.roles?.some((role: string) =>
    ADMIN_ROLES.includes(role as any),
  );

  const layoutVariant = hasAdminRole ? "admin" : "promoter";

  return (
    <Layout variant={layoutVariant}>
      <Outlet />
    </Layout>
  );
}

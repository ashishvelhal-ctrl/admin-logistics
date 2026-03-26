import { createFileRoute } from "@tanstack/react-router";

import Dashboard from "@/feature/admin/dashboard/Dashboard";

export const Route = createFileRoute("/(admin)/dashboard")({
  component: Dashboard,
});

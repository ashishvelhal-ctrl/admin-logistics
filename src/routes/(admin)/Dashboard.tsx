import { createFileRoute } from "@tanstack/react-router";

import AdminDashboard from "@/feature/admin/dashboard/Dashboard";
import { ADMIN_ROLES, requireRoles } from "../guards/-requireRoles";

export const Route = createFileRoute("/(admin)/dashboard")({
  beforeLoad: requireRoles(ADMIN_ROLES),
  component: AdminDashboard,
});

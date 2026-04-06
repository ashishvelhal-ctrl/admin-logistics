import { createFileRoute } from "@tanstack/react-router";
import PromoterDashboard from "#/feature/promoter/dashboard/components/DashBoard";
import { PROMOTER_ROLES, requireRoles } from "../guards/requireRoles";

export const Route = createFileRoute("/(promoter)/dashboardp")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: PromoterDashboard,
});

import { createFileRoute } from "@tanstack/react-router";

import MyPerformance from "@/feature/promoter/performance/MyPerformance";
import { PROMOTER_ROLES, requireRoles } from "../guards/requireRoles";

export const Route = createFileRoute("/(promoter)/myPerformance")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: MyPerformance,
});

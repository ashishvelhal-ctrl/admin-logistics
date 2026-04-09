import { createFileRoute } from "@tanstack/react-router";

import PromoterProfile from "@/feature/promoter/profile/components/PromoterProfile";
import { PROMOTER_ROLES, requireRoles } from "../guards/-requireRoles";

export const Route = createFileRoute("/(promoter)/myProfile")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: PromoterProfile,
});

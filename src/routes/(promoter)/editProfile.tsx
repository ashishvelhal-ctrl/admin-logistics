import { createFileRoute } from "@tanstack/react-router";

import EditProfile from "@/feature/promoter/profile/components/EditProfile";
import { PROMOTER_ROLES, requireRoles } from "../guards/-requireRoles";

export const Route = createFileRoute("/(promoter)/editProfile")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: EditProfile,
});

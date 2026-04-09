import { createFileRoute } from "@tanstack/react-router";

import EditUser from "@/feature/promoter/network/components/EditUser";
import { PROMOTER_ROLES, requireRoles } from "../guards/-requireRoles";

export const Route = createFileRoute("/(promoter)/editUser")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: EditUser,
});

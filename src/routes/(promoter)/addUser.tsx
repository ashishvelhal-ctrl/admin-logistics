import { createFileRoute } from "@tanstack/react-router";
import CreateUser from "@/feature/promoter/user/components/CreateUser";
import { PROMOTER_ROLES, requireRoles } from "../guards/-requireRoles";

export const Route = createFileRoute("/(promoter)/addUser")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: CreateUser,
});

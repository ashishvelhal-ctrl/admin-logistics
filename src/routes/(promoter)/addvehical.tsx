import { createFileRoute } from "@tanstack/react-router";
import CreateVehical from "@/feature/promoter/user/components/CreateVehical";
import { PROMOTER_ROLES, requireRoles } from "../guards/requireRoles";

export const Route = createFileRoute("/(promoter)/addvehical")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: CreateVehical,
});

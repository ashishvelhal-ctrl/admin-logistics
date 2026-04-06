import { createFileRoute } from "@tanstack/react-router";
import CreateTrip from "#/feature/promoter/dashboard/components/CreateTrip";
import { PROMOTER_ROLES, requireRoles } from "../guards/requireRoles";

export const Route = createFileRoute("/(promoter)/createTrip")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: CreateTrip,
});

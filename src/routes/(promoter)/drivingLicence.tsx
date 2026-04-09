import { createFileRoute } from "@tanstack/react-router";
import DrivingLicence from "@/feature/promoter/user/components/DrivingLicence";
import { PROMOTER_ROLES, requireRoles } from "../guards/-requireRoles";

export const Route = createFileRoute("/(promoter)/drivingLicence")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: DrivingLicence,
});

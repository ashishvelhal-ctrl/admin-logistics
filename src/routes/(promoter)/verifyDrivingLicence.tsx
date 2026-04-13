import { createFileRoute } from "@tanstack/react-router";
import VerificationDrivingLicence from "@/feature/promoter/user/components/VerificationDrivingLicence";
import { ADMIN_ROLES, PROMOTER_ROLES, requireRoles } from "../guards/-requireRoles";

export const Route = createFileRoute("/(promoter)/verifyDrivingLicence")({
  beforeLoad: requireRoles([...PROMOTER_ROLES, ...ADMIN_ROLES]),
  component: VerificationDrivingLicence,
});

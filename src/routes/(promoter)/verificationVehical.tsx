import { createFileRoute } from "@tanstack/react-router";
import VerificationVehical from "@/feature/promoter/user/components/VerificationVehical";
import { PROMOTER_ROLES, requireRoles } from "../guards/requireRoles";

export const Route = createFileRoute("/(promoter)/verificationVehical")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: VerificationVehical,
});

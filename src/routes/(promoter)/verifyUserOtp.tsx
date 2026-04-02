import { createFileRoute } from "@tanstack/react-router";

import UserOtpVerification from "@/feature/promoter/user/components/UserOtpVerification";
import { PROMOTER_ROLES, requireRoles } from "../guards/requireRoles";

export const Route = createFileRoute("/(promoter)/verifyUserOtp")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: UserOtpVerification,
});

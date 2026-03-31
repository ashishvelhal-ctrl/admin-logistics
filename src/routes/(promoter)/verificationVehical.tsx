import { createFileRoute, redirect } from "@tanstack/react-router";
import VerificationVehical from "@/feature/promoter/user/components/VerificationVehical";

const promoterRoles = ["promoter"];

const getRolesFromStorage = () => {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return [] as string[];
  }

  const authStorage = sessionStorage.getItem("auth");
  if (!authStorage) return [];

  try {
    const authState = JSON.parse(authStorage);
    return authState.roles || (authState.role ? [authState.role] : []);
  } catch {
    return [];
  }
};

export const Route = createFileRoute("/(promoter)/verificationVehical")({
  beforeLoad: () => {
    if (
      typeof window === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return;
    }

    const roles = getRolesFromStorage();
    if (!roles.length) {
      throw redirect({ to: "/auth/login" });
    }

    const hasAllowedRole = roles.some((role: string) =>
      promoterRoles.includes(role),
    );

    if (!hasAllowedRole) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: VerificationVehical,
});

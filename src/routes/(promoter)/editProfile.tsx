import { createFileRoute, redirect } from "@tanstack/react-router";

import EditProfile from "@/feature/promoter/profile/components/EditProfile";

const promoterRoles = ["promoter"];

export const Route = createFileRoute("/(promoter)/editProfile")({
  beforeLoad: () => {
    if (
      typeof window === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return;
    }

    const authStorage = sessionStorage.getItem("auth");
    if (!authStorage) return [];

    try {
      const authState = JSON.parse(authStorage);
      const roles = authState.roles || (authState.role ? [authState.role] : []);

      if (!roles.length) {
        throw redirect({ to: "/auth/login" });
      }

      const hasAllowedRole = roles.some((role: string) =>
        promoterRoles.includes(role),
      );

      if (!hasAllowedRole) {
        throw redirect({ to: "/auth/login" });
      }
    } catch {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: EditProfile,
});

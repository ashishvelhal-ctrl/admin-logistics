import { redirect } from "@tanstack/react-router";

import { getRolesFromSessionStorage } from "@/lib/auth-storage";

export const PROMOTER_ROLES = ["promoter"] as const;
export const ADMIN_ROLES = [
  "admin",
  "banner-manager",
  "crop-catalogue-manager",
  "asset-catalogue-manager",
  "area-catalogue-manager",
] as const;

export const requireRoles = (allowedRoles: readonly string[]) => () => {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return;
  }

  const roles = getRolesFromSessionStorage();
  if (!roles.length) {
    throw redirect({ to: "/auth/login" });
  }

  const hasAllowedRole = roles.some((role) => allowedRoles.includes(role));
  if (!hasAllowedRole) {
    throw redirect({ to: "/auth/login" });
  }
};

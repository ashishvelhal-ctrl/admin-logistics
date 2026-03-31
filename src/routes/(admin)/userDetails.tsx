import { createFileRoute } from "@tanstack/react-router";

import UserDetails from "@/feature/admin/promoterForm/components/UserDetails";

interface UserDetailsSearch {
  userId?: string;
  promoterId?: string;
}

export const Route = createFileRoute("/(admin)/userDetails")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): UserDetailsSearch => {
    const userId =
      typeof search.userId === "string" ? search.userId : undefined;
    const promoterId =
      typeof search.promoterId === "string" ? search.promoterId : undefined;

    return { userId, promoterId };
  },
});

function RouteComponent() {
  return <UserDetails />;
}

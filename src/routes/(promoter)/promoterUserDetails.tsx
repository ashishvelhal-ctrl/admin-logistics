import { createFileRoute } from "@tanstack/react-router";
import PromoterUserDetails from "@/feature/promoter/network/components/PromoterUserDetails";

interface PromoterUserDetailsSearch {
  userId?: string;
}

export const Route = createFileRoute("/(promoter)/promoterUserDetails")({
  component: PromoterUserDetails,
  validateSearch: (
    search: Record<string, unknown>,
  ): PromoterUserDetailsSearch => {
    return {
      userId: typeof search.userId === "string" ? search.userId : undefined,
    };
  },
});

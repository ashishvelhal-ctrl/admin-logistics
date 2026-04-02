import { createFileRoute } from "@tanstack/react-router";
import PromoterDetails from "@/feature/admin/promoterForm/components/PromoterDetails";

export const Route = createFileRoute("/(admin)/promoterDetails")({
  component: PromoterDetails,
  validateSearch: (search: Record<string, string>) => ({
    promoterId: search.promoterId as string | undefined,
  }),
});

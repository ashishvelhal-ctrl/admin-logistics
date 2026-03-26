import { createFileRoute } from "@tanstack/react-router";
import PromoterEdit from "@/feature/admin/promoterForm/components/PromoterEdit";

export const Route = createFileRoute("/(admin)/promoterEdit")({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>) => ({
    promoterId: search.promoterId as string,
  }),
});

function RouteComponent() {
  return <PromoterEdit />;
}

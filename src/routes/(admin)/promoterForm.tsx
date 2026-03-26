import { createFileRoute } from "@tanstack/react-router";
import PromoterForm from "@/feature/admin/promoterForm/components/PromoterForm";

export const Route = createFileRoute("/(admin)/promoterForm")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PromoterForm />;
}

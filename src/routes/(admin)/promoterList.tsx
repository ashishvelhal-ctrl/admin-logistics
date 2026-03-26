import { createFileRoute } from "@tanstack/react-router";
import PromoterList from "@/feature/admin/promoterForm/components/PromoterList";

export const Route = createFileRoute("/(admin)/promoterList")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PromoterList />;
}

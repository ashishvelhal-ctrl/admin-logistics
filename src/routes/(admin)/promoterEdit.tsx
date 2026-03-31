import { createFileRoute } from "@tanstack/react-router";
import PromoterEdit from "@/feature/admin/promoterForm/components/PromoterEdit";

type PromoterEditSearch = {
  promoterId?: string;
  fullName?: string;
  mobileNumber?: string;
  assignedAddress?: string;
};

export const Route = createFileRoute("/(admin)/promoterEdit")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): PromoterEditSearch => {
    const promoterId =
      typeof search.promoterId === "string" ? search.promoterId : undefined;
    const fullName =
      typeof search.fullName === "string" ? search.fullName : undefined;
    const mobileNumber =
      typeof search.mobileNumber === "string" ? search.mobileNumber : undefined;
    const assignedAddress =
      typeof search.assignedAddress === "string"
        ? search.assignedAddress
        : undefined;

    return { promoterId, fullName, mobileNumber, assignedAddress };
  },
});

function RouteComponent() {
  return <PromoterEdit />;
}

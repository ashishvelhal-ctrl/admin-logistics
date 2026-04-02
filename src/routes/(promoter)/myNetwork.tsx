import { createFileRoute } from "@tanstack/react-router";

import MyNetworkList from "@/feature/promoter/network/components/MyNetworkList";
import { PROMOTER_ROLES, requireRoles } from "../guards/requireRoles";

export const Route = createFileRoute("/(promoter)/myNetwork")({
  beforeLoad: requireRoles(PROMOTER_ROLES),
  component: MyNetworkList,
});

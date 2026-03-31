import { createFileRoute } from "@tanstack/react-router";
import UserList from "@/feature/admin/user/components/UserList";

export const Route = createFileRoute("/(admin)/usersList")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserList />;
}

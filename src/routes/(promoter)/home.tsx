import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(promoter)/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(promoter)/Dashboard"!</div>;
}

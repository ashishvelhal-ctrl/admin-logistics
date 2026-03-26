import { createFileRoute } from "@tanstack/react-router";

import { LoginComponent } from "@/feature/auth/components/Login";

export const Route = createFileRoute("/auth/login")({
  beforeLoad: () => {},
  component: LoginComponent,
});

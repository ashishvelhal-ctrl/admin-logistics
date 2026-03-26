import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/Dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(admin)/Dashboard"!</div>
}

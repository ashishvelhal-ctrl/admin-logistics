import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        TanStack Start project initialized.
      </h1>
      <p className="mt-3 text-base text-zinc-600">
        This is a clean starter with file-based routing. Add your routes in
        <code> src/routes </code> when you are ready.
      </p>
    </main>
  )
}

import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div>
      <h1 className="text-red-500 text-5xl">
        {/* Contact Us */}
      </h1>

      <Outlet />
    </div>
  )
}
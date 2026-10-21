import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_order/order')({
  beforeLoad: () => {
    throw redirect({ to: '/orders' })
  },
  component: () => null,
})

import { createFileRoute } from '@tanstack/react-router';
import OrderFlow from '@/components/OrderFlow/OrderFlow';

export const Route = createFileRoute('/_app/')({
  component: OrderFlow,
});




import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { OrderDetailsPage } from '@/components/OrderFlow/OrderDetails';
import { BottomNavigation } from '@/components/OrderFlow/BottomNavigation';
import { CartProvider } from '@/context/CartContext';
import { ActiveTab } from '@/types/OrderType';

export const Route = createFileRoute('/_app/orders/$orderId')({
  component: OrderDetailRouteWrapper,
});

function OrderDetailContent() {
  const navigate = useNavigate();
  const { orderId } = Route.useParams();
  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'orders') navigate({ to: '/orders' });
    else if (tab === 'home') navigate({ to: '/' });
    else if (tab === 'preorder') navigate({ to: '/preorder' });
    else if (tab === 'cart') navigate({ to: '/cart' });
    else navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased pb-20">
      <main className="max-w-2xl mx-auto min-h-screen relative shadow-2xs bg-[#fcf9f8]">
        <OrderDetailsPage
          orderId={orderId}
          onBack={() => navigate({ to: '/orders' })}
        />
      </main>

      <BottomNavigation
        activeTab="orders"
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}

function OrderDetailRouteWrapper() {
  return (
    <CartProvider>
      <OrderDetailContent />
    </CartProvider>
  );
}

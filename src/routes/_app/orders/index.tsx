import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { OrdersPage } from '@/components/OrderFlow/OrderPage';
import { BottomNavigation } from '@/components/OrderFlow/BottomNavigation';
import { CartProvider } from '@/context/CartContext';
import { ActiveTab } from '@/types/OrderType';

export const Route = createFileRoute('/_app/orders/')({
  component: OrdersRouteWrapper,
});

function OrdersRouteContent() {
  const navigate = useNavigate();

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'orders') return;
    if (tab === 'home') navigate({ to: '/' });
    else if (tab === 'cart') navigate({ to: '/cart' });
    else navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased pb-20">
      <main className="max-w-2xl mx-auto min-h-screen relative shadow-2xs bg-[#fcf9f8]">
        <OrdersPage
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate({ to: '/' });
            }
          }}
          onViewOrderDetails={(id) => navigate({ to: '/orders/$orderId', params: { orderId: id } })}
          onGoToShop={() => navigate({ to: '/' })}
        />
      </main>

      <BottomNavigation
        activeTab="orders"
        onSelectTab={handleSelectTab}
      />
    </div>
  );
}

function OrdersRouteWrapper() {
  return (
    <CartProvider>
      <OrdersRouteContent />
    </CartProvider>
  );
}

import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { OrdersPage } from '@/components/OrderFlow/OrderPage';
import { FeedbackModal } from '@/components/OrderFlow/FeedbackModal';

const FEEDBACK_AFTER_ORDER_KEY = 'show_feedback_after_order';
import { BottomNavigation } from '@/components/OrderFlow/BottomNavigation';
import { CartProvider } from '@/context/CartContext';
import { ActiveTab } from '@/types/OrderType';

export const Route = createFileRoute('/_app/orders/')({
  component: OrdersRouteWrapper,
});

function OrdersRouteContent() {
  const navigate = useNavigate();

  // Feedback popup shows once, immediately after an order is placed (flag set in CartPage).
  const [showFeedback, setShowFeedback] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(FEEDBACK_AFTER_ORDER_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.removeItem(FEEDBACK_AFTER_ORDER_KEY);
    } catch {
      /* ignore */
    }
  }, []);

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

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
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

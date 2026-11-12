import React from 'react';
import {createFileRoute, useNavigate} from '@tanstack/react-router';
import {PreorderPage} from '@/components/OrderFlow/PreorderPage';
import {BottomNavigation} from '@/components/OrderFlow/BottomNavigation';
import {CartProvider} from '@/context/CartContext';
import {ActiveTab} from '@/types/OrderType';

export const Route = createFileRoute('/_app/preorder')({
  component: PreorderRouteWrapper,
});

function PreorderRouteContent() {
  const navigate = useNavigate();

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'preorder') return;
    if (tab === 'orders') navigate({to: '/orders'});
    else if (tab === 'cart') navigate({to: '/cart'});
    else navigate({to: '/'});
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] font-sans text-[#1b1c1c] antialiased">
      <main className="shadow-2xs relative mx-auto min-h-screen max-w-2xl bg-[#fcf9f8]">
        <PreorderPage
          onBack={() => {
            if (window.history.length > 1) window.history.back();
            else navigate({to: '/'});
          }}
        />
      </main>

      <BottomNavigation activeTab="preorder" onSelectTab={handleSelectTab} />
    </div>
  );
}

function PreorderRouteWrapper() {
  return (
    <CartProvider>
      <PreorderRouteContent />
    </CartProvider>
  );
}

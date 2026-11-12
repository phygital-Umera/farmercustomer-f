import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CartPage } from '@/components/OrderFlow/CartPage';
import { AddressModal } from '@/components/OrderFlow/AddressModal';
import { OrderSuccessModal } from '@/components/OrderFlow/OrderSuccessModal';
import { BottomNavigation } from '@/components/OrderFlow/BottomNavigation';
import { Header } from '@/components/OrderFlow/Header';
import { CartProvider, useCart } from '@/context/CartContext';
import { ActiveTab } from '@/types/OrderType';

export const Route = createFileRoute('/_app/cart')({
  component: CartRouteWrapper,
});

function CartRouteContent() {
  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { orderPlaced, setOrderPlaced, latestOrderId } = useCart();

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'cart') return;
    if (tab === 'home') navigate({ to: '/' });
    else if (tab === 'preorder') navigate({ to: '/preorder' });
    else if (tab === 'orders') navigate({ to: '/order' });
    else if (tab === 'categories') navigate({ to: '/' });
  };

  const handleOrderSuccessClose = () => {
    setOrderPlaced(false);
    if (latestOrderId) {
      navigate({ to: '/order' });
    } else {
      navigate({ to: '/order' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased">
      <Header
        onOpenAddress={() => setShowAddressModal(true)}
      />

      <main className="max-w-2xl mx-auto min-h-screen relative shadow-2xs bg-[#fcf9f8]">
        <CartPage
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate({ to: '/' });
            }
          }}
          onOpenAddressModal={() => setShowAddressModal(true)}
          onPlaceOrder={() => setOrderPlaced(true)}
        />
      </main>

      <BottomNavigation
        activeTab="cart"
        onSelectTab={handleSelectTab}
      />

      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} />
      )}

 
    </div>
  );
}

function CartRouteWrapper() {
  return (
    <CartProvider>
      <CartRouteContent />
    </CartProvider>
  );
}

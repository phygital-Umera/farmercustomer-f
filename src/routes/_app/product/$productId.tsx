import React, { useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ItemDetails } from '@/components/OrderFlow/ItemDetails';
import { BottomNavigation } from '@/components/OrderFlow/BottomNavigation';
import { Header } from '@/components/OrderFlow/Header';
import { FloatingCartDock } from '@/components/OrderFlow/FloatingCartDock';
import { AddressModal } from '@/components/OrderFlow/AddressModal';
import { CartProvider } from '@/context/CartContext';
import { useGetAllProducts } from '@/lib/api and mutation/product/useProductApi';
import { mapApiProductToProduct } from '@/utils/productMapper';
import { ActiveTab, Product } from '@/types/OrderType';
import { useState } from 'react';

export const Route = createFileRoute('/_app/product/$productId')({
  component: ProductDetailRouteWrapper,
});

function ProductDetailContent() {
  const navigate = useNavigate();
  const { productId } = Route.useParams();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { data: productsData } = useGetAllProducts();

  const allProducts: Product[] = useMemo(() => {
    const apiList =
      productsData?.data?.products ||
      productsData?.products ||
      (Array.isArray(productsData?.data) ? productsData.data : []);

    if (Array.isArray(apiList) && apiList.length > 0) {
      return apiList.map(mapApiProductToProduct);
    }
    return [];
  }, [productsData]);

  const product = allProducts.find((p) => p.id === productId) || allProducts[0];

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'home') navigate({ to: '/' });
    else if (tab === 'cart') navigate({ to: '/cart' });
    else if (tab === 'orders') navigate({ to: '/orders' });
    else navigate({ to: '/' });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f8]">
        <div className="text-center space-y-3">
          <p className="text-[#525e54] font-medium">Product not found</p>
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="bg-[#00450d] text-white font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased">
      <main className="max-w-2xl mx-auto min-h-screen relative shadow-2xs bg-[#fcf9f8]">
        <ItemDetails
          product={product}
          onBack={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate({ to: '/' });
            }
          }}
          onOpenCart={() => navigate({ to: '/cart' })}
        />
        <FloatingCartDock onViewCart={() => navigate({ to: '/cart' })} />
        <BottomNavigation
          activeTab="home"
          onSelectTab={handleSelectTab}
        />
      </main>

      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} />
      )}
    </div>
  );
}

function ProductDetailRouteWrapper() {
  return (
    <CartProvider>
      <ProductDetailContent />
    </CartProvider>
  );
}

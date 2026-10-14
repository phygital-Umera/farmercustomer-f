import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { HomePage } from './HomePage';
import { CartPage } from './CartPage';
import { ItemDetails } from './ItemDetails';
import { FloatingCartDock } from './FloatingCartDock';
import { OrderSuccessModal } from './OrderSuccessModal';
import { AddressModal } from './AddressModal';
import { CategoriesModal } from './CategoriesModal';
import { OffersModal } from './OffersModal';
import { OrdersPage } from './OrderPage';
import { OrderDetailsPage } from './OrderDetails';
// import { mockProducts } from '@/data/mockProducts';
import { useGetAllProducts } from '@/lib/api and mutation/product/useProductApi';
import { mapApiProductToProduct } from '@/utils/productMapper';
import { ViewState, ActiveTab, Order, Product } from '@/types/OrderType';
import { Phone, Sparkles, X, ChevronRight, Package, MapPin, Tag } from 'lucide-react';

const OrderFlowContent: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(() => {
    // Check initial hash for deep links
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.startsWith('#product-')) {
      return { type: 'product_detail', productId: hash.replace('#product-', '') };
    }
    if (hash.startsWith('#order-')) {
      return { type: 'order_detail', orderId: hash.replace('#order-', '') };
    }
    if (hash === '#cart') return { type: 'cart' };
    if (hash === '#orders') return { type: 'orders' };
    return { type: 'home' };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { orderPlaced, setOrderPlaced, address, repeatOrder, latestOrderId } = useCart();

  // Navigate with browser history support
  const navigateTo = useCallback((nextState: ViewState, push = true) => {
    setViewState(nextState);

    // Sync active tab
    if (nextState.type === 'home') setActiveTab('home');
    else if (nextState.type === 'cart') setActiveTab('cart');
    else if (nextState.type === 'orders') setActiveTab('orders');

    // Update URL hash for deep linking
    let hash = '';
    if (nextState.type === 'cart') hash = '#cart';
    else if (nextState.type === 'orders') hash = '#orders';
    else if (nextState.type === 'product_detail') hash = `#product-${nextState.productId}`;
    else if (nextState.type === 'order_detail') hash = `#order-${nextState.orderId}`;

    if (push && typeof window !== 'undefined') {
      window.history.pushState(nextState, '', hash || window.location.pathname);
    }

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state === 'object' && 'type' in e.state) {
        navigateTo(e.state as ViewState, false);
      } else {
        navigateTo({ type: 'home' }, false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateTo]);

  // Bottom Navigation tab selection
  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'home') {
      navigateTo({ type: 'home' });
    } else if (tab === 'cart') {
      navigateTo({ type: 'cart' });
    } else if (tab === 'orders') {
      navigateTo({ type: 'orders' });
    } else if (tab === 'categories') {
      setShowCategoriesModal(true);
    } else if (tab === 'offers') {
      setShowOffersModal(true);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setShowCategoriesModal(false);
    navigateTo({ type: 'product_detail', productId });
  };

  const handleOpenCart = () => {
    navigateTo({ type: 'cart' });
  };

  const handleRepeatOrder = (order: Order) => {
    repeatOrder(order);
    navigateTo({ type: 'cart' });
  };

  const handleOrderSuccessClose = () => {
    setOrderPlaced(false);
    if (latestOrderId) {
      navigateTo({ type: 'order_detail', orderId: latestOrderId });
    } else {
      navigateTo({ type: 'orders' });
    }
  };

  const { data: productsData } = useGetAllProducts();

  const allProducts: Product[] = useMemo(() => {
    const apiList =
      productsData?.data?.products ||
      productsData?.products ||
      (Array.isArray(productsData?.data) ? productsData.data : []);

    if (Array.isArray(apiList) && apiList.length > 0) {
      return apiList.map(mapApiProductToProduct);
    }
    // return mockProducts;
    return [];
  }, [productsData]);

  // Find currently viewed product if in product_detail view
  const currentProduct =
    viewState.type === 'product_detail'
      ? allProducts.find((p) => p.id === viewState.productId) || allProducts[0]
      : null;

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased selection:bg-[#2e7d32]/20">
      {/* Top Header - Shown on Home and Cart */}
      {(viewState.type === 'home' || viewState.type === 'cart') && (
        <Header
          onOpenAddress={() => setShowAddressModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto min-h-screen relative shadow-2xs bg-[#fcf9f8]">
        {viewState.type === 'home' && (
          <>
            <HomePage
              onSelectProduct={handleSelectProduct}
              onOpenCart={handleOpenCart}
            />
            <FloatingCartDock onViewCart={handleOpenCart} />
            <BottomNavigation
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
            />
          </>
        )}

        {viewState.type === 'product_detail' && currentProduct && (
          <ItemDetails
            product={currentProduct}
            onBack={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigateTo({ type: 'home' });
              }
            }}
            onOpenCart={handleOpenCart}
          />
        )}

        {viewState.type === 'cart' && (
          <>
            <CartPage
              onBack={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigateTo({ type: 'home' });
                }
              }}
              onOpenAddressModal={() => setShowAddressModal(true)}
              onPlaceOrder={() => setOrderPlaced(true)}
            />
            <BottomNavigation
              activeTab="cart"
              onSelectTab={handleSelectTab}
            />
          </>
        )}

        {viewState.type === 'orders' && (
          <>
            <OrdersPage
              onBack={() => navigateTo({ type: 'home' })}
              onViewOrderDetails={(id) => navigateTo({ type: 'order_detail', orderId: id })}
              onGoToShop={() => navigateTo({ type: 'home' })}
            />
            <BottomNavigation
              activeTab="orders"
              onSelectTab={handleSelectTab}
            />
          </>
        )}

        {viewState.type === 'order_detail' && (
          <OrderDetailsPage
            orderId={viewState.orderId}
            onBack={() => navigateTo({ type: 'orders' })}
            onRepeatOrder={handleRepeatOrder}
          />
        )}
      </main>

      {/* Modals and Sheets */}
      {orderPlaced && (
        <OrderSuccessModal onClose={handleOrderSuccessClose} />
      )}

      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} />
      )}

      {showCategoriesModal && (
        <CategoriesModal
          products={allProducts}
          onClose={() => setShowCategoriesModal(false)}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {showOffersModal && (
        <OffersModal onClose={() => setShowOffersModal(false)} />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#00450d] text-white flex items-center justify-center font-bold text-sm">
                  K
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1b1c1c]">Kousen Attar</h3>
                  <p className="text-xs text-[#525e54] flex items-center gap-1">
                    <Phone size={11} /> +91 98200 45892
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#e8f5e9] p-3 rounded-2xl text-xs space-y-1">
              <span className="font-extrabold text-[#1b5e20] flex items-center gap-1">
                <Sparkles size={13} /> Apna Sabzi Mandi Member
              </span>
              <p className="text-[#41493e]">
                Default Address: {address.flat}, {address.city}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-[#1b1c1c] font-medium pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  navigateTo({ type: 'orders' });
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between border border-gray-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Package size={15} className="text-[#1b5e20]" />
                  <span>My Orders &amp; Delivery Tracking</span>
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowAddressModal(true);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between border border-gray-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#1b5e20]" />
                  <span>Manage Delivery Addresses</span>
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setShowOffersModal(true);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between border border-gray-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Tag size={15} className="text-[#1b5e20]" />
                  <span>Mandi Savings &amp; Bachat</span>
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="w-full bg-[#00450d] text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const OrderFlow: React.FC = () => {
  return (
    <CartProvider>
      <OrderFlowContent />
    </CartProvider>
  );
};

export default OrderFlow;

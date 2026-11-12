import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { HomePage } from './HomePage';
import { FloatingCartDock } from './FloatingCartDock';
import { AddressModal } from './AddressModal';
import { CategoriesModal } from './CategoriesModal';
import { OffersModal } from './OffersModal';
import { useGetAllProducts } from '@/lib/api and mutation/product/useProductApi';
import { mapApiProductToProduct } from '@/utils/productMapper';
import { ActiveTab, Order, Product } from '@/types/OrderType';
import { Phone, Sparkles, X, ChevronRight, Package, MapPin, Tag, LogOut, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, setLanguage } from '@/i18n';
import { getUserId } from '@/i18n/languageStorage';
import { useNavigate } from '@tanstack/react-router';
import { useAuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const OrderFlowContent: React.FC = () => {
  const navigate = useNavigate();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { address, repeatOrder } = useCart();
  const { isAuthenticated, logout, user } = useAuthContext();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    setShowProfileModal(false);
    logout();
    toast.success(t('toast.loggedOut'));
    navigate({ to: '/signin' });
  };

  // Bottom Navigation tab selection
  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'home') navigate({ to: '/' });
    else if (tab === 'preorder') navigate({ to: '/preorder' });
    else if (tab === 'cart') navigate({ to: '/cart' });
    else if (tab === 'orders') navigate({ to: '/orders' });
    else if (tab === 'categories') setShowCategoriesModal(true);
    else if (tab === 'offers') setShowOffersModal(true);
  };

  const handleSelectProduct = (productId: string) => {
    setShowCategoriesModal(false);
    navigate({ to: '/product/$productId', params: { productId } });
  };

  const handleOpenCart = () => navigate({ to: '/cart' });

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

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased selection:bg-[#2e7d32]/20">
      {/* Top Header */}
      <Header
        onOpenAddress={() => setShowAddressModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto min-h-screen relative shadow-2xs bg-[#fcf9f8]">
        <HomePage
          onSelectProduct={handleSelectProduct}
          onOpenCart={handleOpenCart}
        />
        <FloatingCartDock onViewCart={handleOpenCart} />
        <BottomNavigation
          activeTab="home"
          onSelectTab={handleSelectTab}
        />
      </main>

      {/* Modals */}
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
                <Sparkles size={13} /> {t('profile.member')}
              </span>
              <p className="text-[#41493e]">
                {t('profile.defaultAddress')} {address.flat}, {address.city}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-[#1b1c1c] font-medium pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  navigate({ to: '/orders' });
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-gray-50 flex items-center justify-between border border-gray-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Package size={15} className="text-[#1b5e20]" />
                  <span>{t('profile.myOrders')}</span>
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
                  <span>{t('profile.manageAddresses')}</span>
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
                  <span>{t('profile.savings')}</span>
                </span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            </div>

            {/* Set Language */}
            <div className="rounded-xl border border-gray-100 p-2.5 space-y-2 text-xs">
              <span className="flex items-center gap-2 font-medium text-[#1b1c1c]">
                <Languages size={15} className="text-[#1b5e20]" />
                {t('profile.setLanguage')}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const active = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() =>
                        setLanguage(lang.code, isAuthenticated ? getUserId(user) || 'customer' : null)
                      }
                      className={`py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                        active ? 'bg-[#00450d] text-white' : 'bg-gray-50 text-[#1b1c1c] hover:bg-gray-100'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
              >
                <LogOut size={15} />
                {t('profile.logout')}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="w-full bg-[#00450d] text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              {t('common.close')}
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

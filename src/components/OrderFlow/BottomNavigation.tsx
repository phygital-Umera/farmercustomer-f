import React from 'react';
import { Store, LayoutGrid, ShoppingBag, FileText, CalendarClock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ActiveTab } from '@/types/OrderType';
import { useTranslation } from 'react-i18next';


interface BottomNavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { totalItemCount } = useCart();
  const { t } = useTranslation();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: <Store size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />,
    },
    {
      id: 'categories',
      label: t('nav.categories'),
      icon: <LayoutGrid size={20} strokeWidth={activeTab === 'categories' ? 2.5 : 2} />,
    },
    {
      id: 'preorder',
      label: t('nav.preorder'),
      icon: <CalendarClock size={20} strokeWidth={activeTab === 'preorder' ? 2.5 : 2} />,
    },
    {
      id: 'orders',
      label: t('nav.orders'),
      icon: <FileText size={20} strokeWidth={activeTab === 'orders' ? 2.5 : 2} />,
    },
    {
      id: 'cart',
      label: t('nav.cart'),
      icon: <ShoppingBag size={20} strokeWidth={activeTab === 'cart' ? 2.5 : 2} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.06] shadow-[0_-2px_10px_rgba(0,0,0,0.03)] pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer relative ${
                isActive ? 'text-[#00450d]' : 'text-[#717a6d] hover:text-[#41493e]'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'cart' && totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#1b5e20] text-white text-[10px] font-bold min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center border-2 border-white">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium tracking-tight ${
                  isActive ? 'font-bold text-[#00450d]' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

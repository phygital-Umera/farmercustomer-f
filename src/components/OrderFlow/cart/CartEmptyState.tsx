import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartEmptyStateProps {
  onBack: () => void;
}

export const CartEmptyState: React.FC<CartEmptyStateProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#fcf9f8] min-h-screen px-4 pt-4 pb-28 text-center flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#1b5e20] mb-4">
        <ShoppingBag size={40} />
      </div>
      <h2 className="text-xl font-bold text-[#1b1c1c]">{t('cart.emptyTitle')}</h2>
      <p className="text-xs text-[#525e54] mt-1 max-w-xs">
        {t('cart.emptyDesc')}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 bg-[#00450d] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow cursor-pointer"
      >
        {t('cart.browse')}
      </button>
    </div>
  );
};

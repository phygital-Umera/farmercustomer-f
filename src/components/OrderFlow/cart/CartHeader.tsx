import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartHeaderProps {
  onBack: () => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm sm:text-base font-bold text-[#1b1c1c] hover:text-[#00450d] transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>{t('common.back')}</span>
        </button>
        <h1 className="text-base sm:text-xl font-black text-[#00450d] tracking-tight truncate">
          {t('cart.title')}
        </h1>
      </div>
    </div>
  );
};

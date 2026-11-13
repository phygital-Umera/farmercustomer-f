import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrderDetailsHeaderProps {
  orderId: string;
  placedAt: string;
  onBack: () => void;
  onOpenHelp: () => void;
}

export const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({
  orderId,
  placedAt,
  onBack,
  onOpenHelp,
}) => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/[0.04]">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-[#1b1c1c] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          aria-label={t('common.back')}
        >
          <ArrowLeft size={22} strokeWidth={2.2} />
        </button>
        <div>
          <h1 className="font-bold text-base sm:text-lg text-[#1b1c1c] tracking-tight">
            {t('orderDetails.title')}
          </h1>
          <p className="text-[11px] text-[#525e54]">
            {orderId} • {placedAt}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenHelp}
        className="p-1.5 text-[#525e54] hover:text-[#00450d] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
        title={t('orderDetails.help')}
      >
        <HelpCircle size={20} />
      </button>
    </div>
  );
};

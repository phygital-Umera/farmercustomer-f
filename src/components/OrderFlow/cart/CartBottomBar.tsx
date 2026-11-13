import React from 'react';
import { ChevronDown, ChevronUp, Loader2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PaymentMethod } from '@/types/OrderType';

interface CartBottomBarProps {
  finalToPay: number;
  showBillDetailModal: boolean;
  onToggleBillDetailModal: () => void;
  onPlaceOrder: () => void;
  isPending: boolean;
  paymentMethod: PaymentMethod;
}

export const CartBottomBar: React.FC<CartBottomBarProps> = ({
  finalToPay,
  showBillDetailModal,
  onToggleBillDetailModal,
  onPlaceOrder,
  isPending,
  paymentMethod,
}) => {
  const { t } = useTranslation();
  const fmt3 = (n: number) => n.toFixed(3);

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-black/[0.08] p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggleBillDetailModal}
          className="flex flex-col text-left cursor-pointer group"
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#00450d]">
              ₹{fmt3(finalToPay)}
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#1b5e20] flex items-center gap-0.5 group-hover:underline">
            {t('cart.viewBill')} {showBillDetailModal ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={onPlaceOrder}
          className="bg-[#00450d] hover:bg-[#1b5e20] disabled:opacity-60 text-white px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 flex-1 max-w-[240px] transition-transform active:scale-95 shadow-md cursor-pointer"
        >
          <div className="text-left leading-tight min-w-0">
            <span className="block text-xs font-black tracking-wider uppercase truncate">
              {isPending ? t('cart.placing') : t('cart.placeOrder')}
            </span>
            <span className="block text-[10px] text-white/80 capitalize font-medium truncate">
              {paymentMethod === 'cod' ? t('common.cod') : paymentMethod.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1 font-bold text-xs bg-white/20 px-2 py-1.5 rounded-lg shrink-0">
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <span>{t('cart.place')}</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';

interface CartBillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsTotal: number;
  finalToPay: number;
}

export const CartBillDetailModal: React.FC<CartBillDetailModalProps> = ({
  isOpen,
  onClose,
  itemsTotal,
  finalToPay,
}) => {
  const { t } = useTranslation();
  const fmt3 = (n: number) => n.toFixed(3);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-end justify-center p-0"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl max-w-md w-full p-5 space-y-4 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
        <h3 className="font-extrabold text-base text-[#1b1c1c]">
          {t('cart.billBreakdown')}
        </h3>

        <div className="space-y-2 text-sm text-[#525e54]">
          <div className="flex justify-between">
            <span>{t('cart.itemsSubtotal')}</span>
            <span className="font-bold text-[#1b1c1c]">₹{fmt3(itemsTotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>{t('cart.deliveryCharge')}</span>
            <span className="font-bold text-[#1b5e20]">{t('common.free')}</span>
          </div>

          <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-[#00450d]">
            <span>{t('cart.totalToPay')}</span>
            <span>₹{fmt3(finalToPay)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#00450d] text-white font-bold py-2.5 rounded-xl cursor-pointer"
        >
          {t('common.ok')}
        </button>
      </div>
    </div>
  );
};

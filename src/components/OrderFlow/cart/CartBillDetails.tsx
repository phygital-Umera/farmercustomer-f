import React from 'react';
import { Receipt } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartBillDetailsProps {
  totalCount: number;
  itemsTotal: number;
  finalToPay: number;
}

export const CartBillDetails: React.FC<CartBillDetailsProps> = ({
  totalCount,
  itemsTotal,
  finalToPay,
}) => {
  const { t } = useTranslation();
  const fmt3 = (n: number) => n.toFixed(3);

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-[#e0e6e0]">
        <div className="flex items-center gap-1.5">
          <Receipt size={16} className="text-[#1b5e20]" />
          <h3 className="font-extrabold text-sm text-[#1b1c1c]">
            {t('cart.billDetails')}
          </h3>
        </div>
        <span className="bg-[#a0f399] text-[#00450d] text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
          {t('cart.noHidden')}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-[#525e54]">
        <div className="flex justify-between">
          <span>{t('cart.itemsPrice', { count: totalCount })}</span>
          <span className="font-bold text-[#1b1c1c]">₹{fmt3(itemsTotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>{t('cart.deliveryCharge')}</span>
          <span className="font-bold text-[#1b5e20]">{t('common.free')}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#e0e6e0] flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-[#1b1c1c] block">
            {t('cart.toPay')}
          </span>
        </div>
        <span className="text-xl font-black text-[#00450d]">
          ₹{fmt3(finalToPay)}
        </span>
      </div>
    </div>
  );
};

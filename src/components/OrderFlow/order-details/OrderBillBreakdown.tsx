import React from 'react';
import { Receipt, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Order } from '@/types/OrderType';

interface OrderBillBreakdownProps {
  order: Order;
}

export const OrderBillBreakdown: React.FC<OrderBillBreakdownProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-2">
      <div className="flex items-center justify-between pb-2 border-b border-[#e0e6e0]">
        <div className="flex items-center gap-1.5">
          <Receipt size={16} className="text-[#1b5e20]" />
          <h3 className="font-extrabold text-sm text-[#1b1c1c]">
            {t('orderDetails.bill')}
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#525e54] uppercase">
          {t('orderDetails.paidVia', {
            method:
              order.paymentMethod === 'cod'
                ? t('common.cod')
                : order.paymentMethod.toUpperCase(),
          })}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-[#525e54]">
        <div className="flex justify-between">
          <span>{t('orderDetails.itemsTotal')}</span>
          <span className="font-bold text-[#1b1c1c]">₹{order.itemsTotal}</span>
        </div>
        <div className="flex justify-between text-[#1b5e20]">
          <span className="flex items-center gap-1">
            <Leaf size={12} /> {t('orderDetails.discount')}
          </span>
          <span className="font-bold">-₹{order.discountTotal}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('cart.deliveryCharge')}</span>
          <span className="font-bold text-[#1b5e20]">
            {order.deliveryCharge === 0 ? t('common.free') : `₹${order.deliveryCharge}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>{t('orderDetails.packing')}</span>
          <span className="font-bold text-[#1b5e20]">{t('orderDetails.packingFree')}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[#e0e6e0] flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-[#1b1c1c] block">
            {t('orderDetails.totalPaid')}
          </span>

          {order.note && (
            <span className="text-[13px] text-[#1b5e20] font-bold">
              {t('orders.note', { note: order.note })}
            </span>
          )}
        </div>
        <span className="text-xl font-black text-[#00450d]">
          ₹{order.totalPaid}
        </span>
      </div>
    </div>
  );
};

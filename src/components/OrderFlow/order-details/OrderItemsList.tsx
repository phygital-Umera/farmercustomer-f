import React from 'react';
import { Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OrderItem } from '@/types/OrderType';

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm sm:text-base text-[#1b1c1c]">
          {t('orderDetails.orderedItems', { count: items.length })}
        </h3>
        <span className="text-[11px] font-semibold text-[#1b5e20] flex items-center gap-1">
          <Scale size={12} /> {t('orderDetails.scaleVerified')}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[#e0e6e0] divide-y divide-[#e0e6e0] overflow-hidden shadow-2xs">
        {items.map((item, idx) => (
          <div key={idx} className="p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-black/5 shrink-0"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#1b1c1c] leading-snug line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[11px] text-[#525e54]">
                  {item.weight} • {t('orders.qty', { count: item.quantity })}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-black text-sm text-[#00450d]">
                {item.price === 0 ? t('common.free') : `₹${item.price}`}
              </span>
              {item.mrp > item.price && (
                <span className="block text-[10px] text-[#9eaaa0] line-through">
                  ₹{item.mrp}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

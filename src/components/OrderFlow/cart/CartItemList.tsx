import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuantityStepper } from '../QuantityStepper';
import { DisplayCartItem } from './types';

interface CartItemListProps {
  items: DisplayCartItem[];
  onQuantityChange: (item: DisplayCartItem, nextCount: number) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onQuantityChange,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="bg-white rounded-2xl border border-[#e0e6e0] divide-y divide-[#e0e6e0] overflow-hidden shadow-2xs">
        {items.map((item) => {
          const itemTotal = item.price * item.count;

          return (
            <div
              key={item.id}
              className="p-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-black/5 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-[#1b5e20] font-black text-xs uppercase shrink-0">
                    {item.name?.slice(0, 3)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-[#1b1c1c] leading-snug truncate capitalize">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#525e54] font-medium mt-0.5">
                    {t('cart.weight', { weight: item.weightLabel })}
                  </p>
                  <div className="mt-1">
                    <span className="font-black text-sm text-[#00450d]">
                      ₹{itemTotal}
                    </span>
                  </div>
                </div>
              </div>

              <QuantityStepper
                quantity={item.count}
                onIncrement={() => {
                  onQuantityChange(item, item.count + 1);
                }}
                onDecrement={() => {
                  const nextCount = Math.max(0, item.count - 1);
                  onQuantityChange(item, nextCount);
                }}
                size="md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '@/types/OrderType';
import { QuantityStepper } from '../QuantityStepper';
import { qtyKey } from './types';

interface PreorderProductCardProps {
  product: Product;
  selectedWeight: string;
  onSelectWeight: (weight: string) => void;
  quantities: Record<string, number>;
  onChangeQty: (productId: string, weight: string, delta: number) => void;
}

export const PreorderProductCard: React.FC<PreorderProductCardProps> = ({
  product,
  selectedWeight,
  onSelectWeight,
  quantities,
  onChangeQty,
}) => {
  const { t } = useTranslation();
  const count = quantities[qtyKey(product.id, selectedWeight)] || 0;

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-md border border-[#e0e6e0] bg-white shadow-sm">
      <div className="relative flex aspect-square w-full items-center justify-center bg-[#f4f6f4]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <div className="flex-1">
          <h3 className="line-clamp-1 text-xs font-bold leading-snug text-[#1a1c1a] sm:text-sm">
            {product.name}
          </h3>

          {/* Weight pills (no price) */}
          <div className="mb-2 mt-2 flex gap-1 overflow-x-auto pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {product.weightOptions.map((w) => {
              const isSel = w.weight === selectedWeight;
              const wCount = quantities[qtyKey(product.id, w.weight)] || 0;
              return (
                <button
                  key={w.weight}
                  type="button"
                  onClick={() => onSelectWeight(w.weight)}
                  className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-all ${
                    isSel
                      ? 'shadow-2xs border-[#2e7d32] bg-[#e8f5e9] font-bold text-[#1b5e20]'
                      : 'border-[#cfd8d0] bg-white text-[#525e54] hover:border-[#2e7d32]/60'
                  }`}
                >
                  {w.weight}
                  {wCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#1b5e20] px-0.5 text-[9px] font-bold text-white">
                      {wCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          {count > 0 ? (
            <QuantityStepper
              quantity={count}
              onIncrement={() => onChangeQty(product.id, selectedWeight, 1)}
              onDecrement={() => onChangeQty(product.id, selectedWeight, -1)}
              size="sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => onChangeQty(product.id, selectedWeight, 1)}
              className="shadow-2xs h-7 cursor-pointer rounded-lg border border-[#2e7d32] bg-white px-3 text-xs font-black uppercase tracking-wider text-[#2e7d32] transition-all hover:bg-[#e8f5e9] active:scale-95"
            >
              {t('common.add')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

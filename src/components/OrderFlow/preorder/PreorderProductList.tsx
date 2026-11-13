import React from 'react';
import { Loader2, ShoppingBasket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product } from '@/types/OrderType';
import { SearchBar } from '../SearchBar';
import { PreorderProductCard } from './PreorderProductCard';

interface PreorderProductListProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  loading: boolean;
  products: Product[];
  selectedWeights: Record<string, string>;
  onSelectWeight: (productId: string, weight: string) => void;
  quantities: Record<string, number>;
  onChangeQty: (productId: string, weight: string, delta: number) => void;
}

export const PreorderProductList: React.FC<PreorderProductListProps> = ({
  searchQuery,
  setSearchQuery,
  loading,
  products,
  selectedWeights,
  onSelectWeight,
  quantities,
  onChangeQty,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Products title + search */}
      <div className="space-y-2">
        <h2 className="text-sm font-extrabold text-[#1b1c1c]">
          {t('preorder.whatNeed')}
        </h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {loading ? (
        <div className="py-10 text-center text-[#1b5e20]">
          <Loader2 size={24} className="mx-auto animate-spin" />
          <p className="mt-2 text-xs font-semibold">
            {t('preorder.loading')}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-[#525e54]">
          <ShoppingBasket size={36} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold">{t('categories.emptyTitle')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {products.map((p) => {
            const currentWeight =
              selectedWeights[p.id] ||
              p.defaultWeight ||
              p.weightOptions[0]?.weight ||
              '';

            return (
              <PreorderProductCard
                key={p.id}
                product={p}
                selectedWeight={currentWeight}
                onSelectWeight={(weight) => onSelectWeight(p.id, weight)}
                quantities={quantities}
                onChangeQty={onChangeQty}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

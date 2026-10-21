import React, { useMemo } from 'react';
import { X, ShoppingBasket, Scale, Sparkles, Carrot, Salad, ChevronRight } from 'lucide-react';
// import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/OrderType';
import { useGetAllProducts } from '@/lib/api and mutation/product/useProductApi';
import { mapApiProductToProduct } from '@/utils/productMapper';

interface CategoriesModalProps {
  onClose: () => void;
  onSelectProduct: (id: string) => void;
  products?: Product[];
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  onClose,
  onSelectProduct,
  products,
}) => {
  const { data: productsData } = useGetAllProducts();

  const availableProducts = useMemo(() => {
    if (products && products.length > 0) return products;
    const apiList =
      productsData?.data?.products ||
      productsData?.products ||
      (Array.isArray(productsData?.data) ? productsData.data : []);
    if (Array.isArray(apiList) && apiList.length > 0) {
      return apiList.map(mapApiProductToProduct);
    }
    return [];
  }, [products, productsData]);

  const categoryGroups = useMemo(() => {
    const groups = [
      {
        id: 'daily',
        title: 'Daily Essentials',
        icon: <Scale size={20} className="text-[#1b5e20]" />,
        items: availableProducts.filter((p) => p.category?.toLowerCase() === 'daily'),
      },
      {
        id: 'leafy',
        title: 'Leafy Greens & Shagun Tadka',
        icon: <Sparkles size={20} className="text-[#1b5e20]" />,
        items: availableProducts.filter((p) => p.category?.toLowerCase() === 'leafy'),
      },
      {
        id: 'roots',
        title: 'Root & Underground Vegetables',
        icon: <Carrot size={20} className="text-[#1b5e20]" />,
        items: availableProducts.filter((p) => p.category?.toLowerCase() === 'roots'),
      },
      {
        id: 'exotic',
        title: 'Exotic & Salads',
        icon: <Salad size={20} className="text-[#1b5e20]" />,
        items: availableProducts.filter((p) => p.category?.toLowerCase() === 'exotic'),
      },
    ];

    const standardIds = new Set(['daily', 'leafy', 'roots', 'exotic']);
    const otherProducts = availableProducts.filter((p) => !standardIds.has(p.category?.toLowerCase()));
    if (otherProducts.length > 0) {
      groups.push({
        id: 'other',
        title: 'Other Items',
        icon: <ShoppingBasket size={20} className="text-[#1b5e20]" />,
        items: otherProducts,
      });
    }

    return groups.filter((g) => g.items.length > 0);
  }, [availableProducts]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#00450d]">
            <ShoppingBasket size={22} />
            <h3 className="font-extrabold text-lg">Mandi Categories</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pt-3 flex-1">
          {categoryGroups.length === 0 ? (
            <div className="py-12 text-center text-[#525e54]">
              <ShoppingBasket size={36} className="mx-auto mb-2 opacity-40 text-[#1b5e20]" />
              <p className="text-sm font-bold text-[#1b1c1c]">No Products Found</p>
              <p className="text-xs text-[#717a6d] mt-1">Abhi koi categories uplabdh nahi hain</p>
            </div>
          ) : (
            categoryGroups.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[#1b1c1c] uppercase tracking-wider">
                  {cat.icon}
                  <span>{cat.title}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {cat.items.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl border border-stroke hover:border-[#1b5e20] bg-[#f9fbf9] flex items-center gap-2.5 cursor-pointer transition-all hover:shadow-xs group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-[#1b1c1c] truncate group-hover:text-[#00450d]">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-[#1b5e20] font-bold flex items-baseline gap-1">
                          {prod.cutPrice && prod.cutPrice > 0 ? (
                            <span className="text-[10px] text-gray-400 line-through font-normal">
                              ₹{prod.cutPrice.toLocaleString('en-IN')}
                            </span>
                          ) : null}
                          <span>₹{prod.price.toLocaleString('en-IN')}</span>
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-[#1b5e20]" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

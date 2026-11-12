import React, { useState, useMemo } from 'react';
import {
  ShoppingBasket,
  Scale,
  Sparkles,
  Carrot,
  Salad,
  Zap,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Star,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Product } from '@/types/OrderType';
// import { mockProducts } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';
import { QuantityStepper } from './QuantityStepper';
import { SearchBar } from './SearchBar';
import { BannerCarousel } from './BannerCarousel';
import { useGetAllProducts } from '@/lib/api and mutation/product/useProductApi';
import { mapApiProductToProduct } from '@/utils/productMapper';
import { useAuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { currentLocale } from '@/i18n';

interface HomePageProps {
  onSelectProduct: (productId: string) => void;
  onOpenCart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, onOpenCart }) => {
  const { addToCart, updateQuantity, getItemQuantity, items } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts();

  const { isAuthenticated } = useAuthContext();
  const { t } = useTranslation();


  // Map API response to UI Product model, fallback to empty list if API list is empty
  const allProducts: Product[] = useMemo(() => {
    const apiList =
      productsData?.data?.products ||
      productsData?.products ||
      (Array.isArray(productsData?.data) ? productsData.data : []);

    if (Array.isArray(apiList) && apiList.length > 0) {
      return apiList.map(mapApiProductToProduct);
    }
    return [];
  }, [productsData]);

  // Extract categories dynamically from available products
  const categories = useMemo(() => {
    const list: { id: string; label: string; icon: React.ReactNode }[] = [
      { id: 'all', label: t('home.allProducts'), icon: <ShoppingBasket size={15} /> },
    ];

    const seen = new Set<string>();
    allProducts.forEach((p) => {
      const catKey = p.category ? p.category.toLowerCase() : '';
      if (catKey && !seen.has(catKey)) {
        seen.add(catKey);
        list.push({
          id: catKey,
          label: p.categoryLabel || p.category,
          icon: <Scale size={15} />,
        });
      }
    });

    return list;
  }, [allProducts, t]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.hindiName && product.hindiName.toLowerCase().includes(q)) ||
        (product.englishSubtitle && product.englishSubtitle.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  const handleSelectWeight = (productId: string, weight: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Only switch the displayed variant; the cart changes on + ADD / + only
    setSelectedWeights((prev) => ({ ...prev, [productId]: weight }));
  };

  return (
    <div className="pb-28">
      {/* Search Header Container */}
      <div className="px-4 pt-2 pb-3 bg-[#fcf9f8]">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Store banners (static if one, auto-sliding if many) */}
      <div className="px-4 pb-2">
        <BannerCarousel />
      </div>

      {/* Category Pills Bar matching Screenshot 3 */}
      <div className="px-4 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                isActive
                  ? 'bg-[#00450d] text-white shadow-sm'
                  : 'bg-[#e5e2e1]/70 hover:bg-[#e5e2e1] text-[#1b1c1c]'
              }`}
            >
              <span className={isActive ? 'text-[#a0f399]' : 'text-[#41493e]'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>


      {/* Section Header */}
      <div className="px-4 mt-2 mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1b1c1c] tracking-tight">
            {t('home.sectionTitle')}
          </h2>
         
        </div>
       
      </div>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredProducts.map((product) => {
          const currentWeight = selectedWeights[product.id] || product.defaultWeight;
          const currentOption =
            product.weightOptions.find((w) => w.weight === currentWeight) ||
            product.weightOptions[0];
          const activePrice = currentOption ? currentOption.price : product.price;
          const activeMrp = currentOption ? currentOption.mrp : product.mrp;
          const activeCutPrice = currentOption?.cutPrice ?? product.cutPrice;
          const currentQty = getItemQuantity(product.id, currentWeight);
          // Amount = total of all this product's variants in the cart; single variant price otherwise
          const productLines = items.filter((i) => i.product.id === product.id);
          const productTotal = productLines.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
          const productCutTotal = productLines.reduce((s, i) => {
            const opt = product.weightOptions.find((w) => w.weight === i.selectedWeight);
            return s + (opt?.cutPrice ?? 0) * i.quantity;
          }, 0);
          const hasInCart = productTotal > 0;
          const displayPrice = hasInCart ? productTotal : activePrice;
          const displayCut = hasInCart ? productCutTotal : activeCutPrice;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              className="bg-white rounded-md  border border-[#e0e6e0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
            >
              {/* Top badges & Image */}
              <div className="relative">
               

                <div className="w-full aspect-square relative bg-[#f4f6f4] flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f4f6f4]" />
                  )}
                </div>
              </div>

              {/* Below Details */}
              <div className="flex flex-col flex-1 p-2.5">
                {/* Title & Vernacular Name */}
                <div className="flex-1">
                  <h3 className="font-bold text-xs sm:text-sm text-[#1a1c1a] line-clamp-1 leading-snug">
                    {product.name}
                  </h3>
                 

                  {/* Weight Pills Row */}
                  <div className="flex gap-1 mt-2 mb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {product.weightOptions.map((w) => {
                      const isSelected = w.weight === currentWeight;
                      return (
                        <button
                          key={w.weight}
                          type="button"
                          onClick={(e) => handleSelectWeight(product.id, w.weight, e)}
                          className={`shrink-0 whitespace-nowrap text-[11px] px-2 py-0.5 rounded-lg font-semibold border transition-all cursor-pointer flex flex-col items-center leading-tight ${
                            isSelected
                              ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] font-bold shadow-2xs'
                              : 'bg-white border-[#cfd8d0] text-[#525e54] hover:border-[#2e7d32]/60'
                          }`}
                        >
                          <span>{w.weight}</span>
                          <span className="text-[10px] font-medium opacity-80">
                            ₹{w.price.toLocaleString(currentLocale())}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="pt-1 flex items-center justify-between gap-1 mt-1">
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {displayCut && displayCut > displayPrice ? (
                        <span className="text-xs sm:text-xs text-[#8a948c] line-through font-normal">
                          ₹{displayCut.toLocaleString(currentLocale())}
                        </span>
                      ) : null}
                      <span className="font-extrabold text-sm sm:text-base text-[#1a1c1a]">
                        ₹{displayPrice.toLocaleString(currentLocale())}
                      </span>
                    </div>
                  </div>

                  {currentQty > 0 ? (
                    <QuantityStepper
                      quantity={currentQty}
                      onIncrement={() => {
                        const rawQty = currentOption?.rawQty ?? (parseFloat(currentWeight) || 1);
                        const payload = {
                          productId: product.id,
                          price: activePrice,
                          productQuantity: rawQty,
                          productCount: currentQty + 1,
                        };
                        console.log('🛒 Cart Item:', payload);
                        updateQuantity(product.id, currentWeight, 1);
                      }}
                      onDecrement={() => {
                        const rawQty = currentOption?.rawQty ?? (parseFloat(currentWeight) || 1);
                        const payload = {
                          productId: product.id,
                          price: activePrice,
                          productQuantity: rawQty,
                          productCount: currentQty - 1,
                        };
                        console.log('🛒 Cart Item:', payload);
                        updateQuantity(product.id, currentWeight, -1);
                      }}
                      size="sm"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rawQty = currentOption?.rawQty ?? (parseFloat(currentWeight) || 1);
                        const payload = {
                          productId: product.id,
                          price: activePrice,
                          productQuantity: rawQty,
                          productCount: 1,
                        };
                        console.log('🛒 Cart Item:', payload);
                        addToCart(product, currentWeight, activePrice, activeMrp);
                      }}
                      className="h-7 px-3 rounded-lg border-1.5 border-[#2e7d32] bg-white hover:bg-[#e8f5e9] text-[#2e7d32] font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-2xs cursor-pointer"
                    >
                      {t('common.add')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {productsLoading ? (
        <div className="px-4 py-16 text-center text-[#525e54]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1b5e20] border-r-transparent align-[-0.125em]" />
          <p className="mt-3 text-xs font-semibold text-[#1b5e20]">{t('home.loading')}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="px-4 py-12 text-center text-[#525e54]">
          <ShoppingBasket size={42} className="mx-auto text-[#717a6d] mb-2 opacity-50" />
          <p className="font-bold text-sm">{t('home.emptyTitle')}</p>
          <p className="text-xs text-[#717a6d] mt-1">
            {searchQuery
              ? t('home.emptySearch')
              : t('home.emptyNone')}
          </p>
        </div>
      ) : null}

      {/* Trust reassurance cards & Feedback button */}
     { isAuthenticated && (<div className="px-4 mt-6 space-y-3">
        <div className="bg-[#e8f5e9] rounded-2xl p-3.5 border border-[#c0c9bb]/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div className="text-xs text-[#1b5e20]">
              <p className="font-extrabold text-[13px]">
                {t('home.guaranteeTitle')}
              </p>
              <p className="text-[#41493e] mt-0.5 leading-snug">
                {t('home.guaranteeDesc')}
              </p>
            </div>
          </div>
        </div>

      </div>)}
    </div>
  );
};

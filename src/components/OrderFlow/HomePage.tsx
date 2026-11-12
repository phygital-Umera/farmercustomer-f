import React, { useState, useMemo, useEffect } from 'react';
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
  X,
  MessageSquareHeart,
  Star,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Product } from '@/types/OrderType';
// import { mockProducts } from '@/data/mockProducts';
import { useCart } from '@/context/CartContext';
import { QuantityStepper } from './QuantityStepper';
import { SearchBar } from './SearchBar';
import { useGetAllProducts, useSubmitFeedback } from '@/lib/api and mutation/product/useProductApi';
import { mapApiProductToProduct } from '@/utils/productMapper';
import z from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface HomePageProps {
  onSelectProduct: (productId: string) => void;
  onOpenCart: () => void;
}

const feedbackschema = z.object({
  quality: z.string().min(1, 'Please select Quality rating'),
  service: z.string().min(1, 'Please select Service rating'),
  staffRegard: z.string().min(1, 'Please select Staff Regard rating'),
  note: z.string().optional().default(''),
  GOOD: z.string().optional(),
  POOR: z.string().optional(),
  EXCELLENT: z.string().optional(),
});

type feedbacktype = z.infer<typeof feedbackschema>;

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, onOpenCart }) => {
  const { addToCart, updateQuantity, getItemQuantity, updateProductWeight, items } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts();

  const { isAuthenticated, user } = useAuthContext();
  const [isFeedBackForm, setIsFeedBackForm] = useState<boolean>(false);


  const {mutate: submitFeedback} = useSubmitFeedback()

  // Form handling
  const method = useForm<feedbacktype>({
    resolver: zodResolver(feedbackschema),
    defaultValues: {
      quality: '',
      service: '',
      staffRegard: '',
      note: '',
      GOOD: '',
      POOR: '',
      EXCELLENT: '',
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    reset,
    formState: { errors },
  } = method;

  const currentQuality = watch('quality');
  const currentService = watch('service');
  const currentStaffRegard = watch('staffRegard');

  // Reset form to blank when opened so no option is pre-selected by default
  useEffect(() => {
    if (isFeedBackForm) {
      reset({
        quality: '',
        service: '',
        staffRegard: '',
        note: '',
      });
    }
  }, [isFeedBackForm, reset]);

  // One-time feedback prompt when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const userId = user?.id || user?.userId || (user as any)?.user?.id || 'customer_user';
      const alreadySubmitted = localStorage.getItem(`mandi_feedback_done_${userId}`);
      const alreadyDismissed = sessionStorage.getItem(`mandi_feedback_dismissed_${userId}`);
      if (!alreadySubmitted && !alreadyDismissed) {
        const timer = setTimeout(() => {
          setIsFeedBackForm(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const onFeedBackSubmit = (data: feedbacktype) => {
    console.log('📝 Feedback Submitted:', data);
    submitFeedback(data)

  
    setIsFeedBackForm(false);
    reset({
      quality: '',
      service: '',
      staffRegard: '',
      note: '',
    });
  };

  const handleDismissFeedback = () => {

    console
    setIsFeedBackForm(false);
    reset({
      quality: '',
      service: '',
      staffRegard: '',
      note: '',
    });
  };

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
      { id: 'all', label: 'All Products', icon: <ShoppingBasket size={15} /> },
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
  }, [allProducts]);

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
    setSelectedWeights((prev) => ({ ...prev, [productId]: weight }));

    const product = allProducts.find((p) => p.id === productId);
    if (product) {
      const option = product.weightOptions.find((w) => w.weight === weight);
      const price = option ? option.price : product.price;
      const mrp = option ? option.mrp : product.mrp;
      updateProductWeight(productId, weight, price, mrp);
    }
  };

  return (
    <div className="pb-28">
      {/* Search Header Container */}
      <div className="px-4 pt-2 pb-3 bg-[#fcf9f8]">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
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

      {/* Fresh Mandi Promise Banner */}
     

      {/* Section Header */}
      <div className="px-4 mt-2 mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1b1c1c] tracking-tight">
            Taaza Sabziyan (Fresh Veggies)
          </h2>
         
        </div>
       
      </div>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredProducts.map((product) => {
          const cartItem = items.find((i) => i.product.id === product.id);
          const currentWeight =
            selectedWeights[product.id] || cartItem?.selectedWeight || product.defaultWeight;
          const currentOption =
            product.weightOptions.find((w) => w.weight === currentWeight) ||
            product.weightOptions[0];
          const activePrice = currentOption ? currentOption.price : product.price;
          const activeMrp = currentOption ? currentOption.mrp : product.mrp;
          const activeCutPrice = currentOption?.cutPrice ?? product.cutPrice;
          const currentQty = getItemQuantity(product.id, currentWeight);

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
                          className={`shrink-0 whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] font-bold shadow-2xs'
                              : 'bg-white border-[#cfd8d0] text-[#525e54] hover:border-[#2e7d32]/60'
                          }`}
                        >
                          {w.weight}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="pt-1 flex items-center justify-between gap-1 mt-1">
                  <div>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {activeCutPrice && activeCutPrice > 0 ? (
                        <span className="text-xs sm:text-xs text-[#8a948c] line-through font-normal">
                          ₹{activeCutPrice.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                      <span className="font-extrabold text-sm sm:text-base text-[#1a1c1a]">
                        ₹{activePrice.toLocaleString('en-IN')}
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
                      + ADD
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
          <p className="mt-3 text-xs font-semibold text-[#1b5e20]">Mandi se taaza sabziyan load ho rahi hain...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="px-4 py-12 text-center text-[#525e54]">
          <ShoppingBasket size={42} className="mx-auto text-[#717a6d] mb-2 opacity-50" />
          <p className="font-bold text-sm">Koi sabzi nahi mili!</p>
          <p className="text-xs text-[#717a6d] mt-1">
            {searchQuery
              ? "Doosra naam try karein jaise 'tamatar', 'aloo', 'palak'."
              : 'Abhi koi products uplabdh nahi hain.'}
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
                Apna Mandi Shuddhta Guarantee
              </p>
              <p className="text-[#41493e] mt-0.5 leading-snug">
                Har sabzi digital kaante par tauli jaati hai. Kuch pasand na aaye toh bina sawaal doorstep replacement!
              </p>
            </div>
          </div>
        </div>

        {/* Manual Feedback trigger banner if user wants to give feedback anytime */}
        <div className="bg-white rounded-2xl p-3 border border-[#e0e6e0] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00450d]/10 text-[#00450d] flex items-center justify-center">
              <MessageSquareHeart size={16} />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#1b1c1c]">Aapka Sujhav / Feedback</p>
              <p className="text-[11px] text-[#525e54]">Quality, service aur staff rating share karein</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFeedBackForm(true)}
            className="bg-[#00450d] hover:bg-[#1b5e20] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Feedback
          </button>
        </div>
      </div>)}

      {/* Feedback Modal (One-time when authenticated or on manual click) */}
 {isFeedBackForm &&  (
  <div
  
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    onClick={handleDismissFeedback}
  >
  
    <div
      className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-4 shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MessageSquareHeart size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Apna Mandi Feedback</h3>
            <p className="text-[10px] text-gray-500">Aapka anubhav humare liye mahtvapoorna hai</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismissFeedback}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onFeedBackSubmit)} className="space-y-3">
          
          {/* Rating Section Helper */}
          {[
            {
              id: 'quality' as const,
              title: '1. Sabzi Quality',
              value: currentQuality,
            },
            {
              id: 'service' as const,
              title: '2. Delivery Service',
              value: currentService,
            },
            {
              id: 'staffRegard' as const,
              title: '3. Staff Behavior',
              value: currentStaffRegard,
            },
          ].map((field) => (
            <div key={field.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-800">{field.title}</label>
              </div>
              <div className="flex gap-2">
                {[
                  { key: 'EXCELLENT', label: 'Excellent' },
                  { key: 'GOOD', label: 'Good' },
                  { key: 'POOR', label: 'Poor' },
                ].map((opt) => {
                  const isSelected = Boolean(field.value && field.value === opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        setValue(field.id, isSelected ? '' : opt.key, { shouldValidate: true });
                      }}
                      className={`flex-1 py-1.5 px-1 rounded-lg border text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold shadow-sm ring-1 ring-emerald-600'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors[field.id] && (
                <p className="text-[10px] text-red-500 font-medium">{errors[field.id]?.message}</p>
              )}
            </div>
          ))}

          {/* Suggestion / Note */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">4. Suggestion (Optional)</label>
            <textarea
              {...register('note')}
              rows={2}
              placeholder="Koi sujhav share karein..."
              className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDismissFeedback}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Later
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  </div>
)}
    </div>
  );
};

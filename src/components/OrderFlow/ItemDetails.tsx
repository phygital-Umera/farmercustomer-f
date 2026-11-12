import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Heart,
  User,
  Zap,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Smile,
  RefreshCw,
  UtensilsCrossed,
  Plus,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { Product, unit } from '@/types/OrderType';
import { useCart } from '@/context/CartContext';
import { QuantityStepper } from './QuantityStepper';
import { useTranslation } from 'react-i18next';
import { currentLocale } from '@/i18n';

interface ItemDetailsProps {
  product: Product;
  onBack: () => void;
  onOpenCart: () => void;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({
  product,
  onBack,
  onOpenCart,
}) => {
  const { addToCart, updateQuantity, getItemQuantity, addTadkaItem, items } = useCart();
  const { t } = useTranslation();
  const cartItem = items.find((i) => i.product.id === product.id);
  const [selectedWeight, setSelectedWeight] = useState<string>(
    cartItem?.selectedWeight || product.defaultWeight || product.weightOptions[0]?.weight || '1 kg'
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [addedTadkaIds, setAddedTadkaIds] = useState<Record<string, boolean>>({});

  const activeWeightOption =
    product.weightOptions.find((w) => w.weight === selectedWeight) ||
    product.weightOptions[0];

  const currentPrice = activeWeightOption ? activeWeightOption.price : product.price;
  const currentMrp = activeWeightOption ? activeWeightOption.mrp : product.mrp;
  const currentCutPrice = activeWeightOption?.cutPrice ?? product.cutPrice;
  const savings = (currentCutPrice && currentCutPrice > currentPrice ? currentCutPrice : currentMrp) - currentPrice;
  const currentQty = getItemQuantity(product.id, selectedWeight);

  // Amount = total of all this product's variants in the cart; single variant price otherwise
  const productTotal = items
    .filter((i) => i.product.id === product.id)
    .reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const hasInCart = productTotal > 0;
  const displayPrice = hasInCart ? productTotal : currentPrice;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: t('product.shareText', { name: product.name }),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleTadkaAdd = (tadka: any) => {
    addTadkaItem(tadka);
    setAddedTadkaIds((prev) => ({ ...prev, [tadka.id]: true }));
    setTimeout(() => {
      setAddedTadkaIds((prev) => ({ ...prev, [tadka.id]: false }));
    }, 1500);
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen pb-48">
      {/* Top Header Bar matching Screenshot 3 */}
      <div className="sticky top-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-[#1b1c1c] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            aria-label={t('common.back')}
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </button>
          <h1 className="font-bold text-base sm:text-lg text-[#1b1c1c] tracking-tight">
            {t('product.title')}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#41493e] hover:text-[#00450d] transition-colors relative cursor-pointer"
            aria-label={t('product.share')}
          >
            <Share2 size={16} />
            {copiedShare && (
              <span className="absolute -bottom-6 bg-black text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                {t('product.linkCopied')}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted ? 'text-red-500 fill-red-500' : 'text-[#41493e] hover:text-red-500'
            }`}
            aria-label={t('product.wishlist')}
          >
            <Heart size={16} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
          </button>

          <div className="w-8 h-8 rounded-full bg-[#00450d] text-white flex items-center justify-center">
            <User size={16} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Origin Pill */}
  

        {/* Hero Image with Badges */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-black/[0.06] shadow-sm">
          {/* Top Freshness Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#00450d] text-white text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {t('product.freshBadge')}
            </span>
          </div>

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-[4/3] object-cover"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-[#f4f6f4]" />
          )}

          {/* Bottom Right Digital Wazan Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#00450d] text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-black/5">
              <Scale size={12} className="text-[#1b5e20]" />
              <span>
                {t(
                  product.unit === unit.KG || product.unit === unit.GRAM
                    ? 'product.badgeWeight'
                    : product.unit === unit.LTR || product.unit === unit.ML
                      ? 'product.badgePure'
                      : 'product.badgeVerified',
                )}
              </span>
            </span>
          </div>
        </div>

        {/* Product Title and Discount */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#1b1c1c] tracking-tight">
              {product.name}
            </h2>
          
          </div>

          <p className="text-sm text-[#525e54] mt-1 font-medium">
            {product.englishSubtitle}
          </p>

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-baseline gap-2">
              {currentCutPrice && currentCutPrice > 0 ? (
                <span className="text-base sm:text-lg text-[#8a948c] line-through font-normal">
                  ₹{currentCutPrice.toLocaleString(currentLocale())}
                </span>
              ) : null}
              <span className="text-2xl sm:text-3xl font-extrabold text-[#00450d] tracking-tight">
                ₹{currentPrice.toLocaleString(currentLocale())}
              </span>
            </div>

            {/* Quick Add Button or Quantity Stepper by the Price */}
            <div>
              {currentQty > 0 ? (
                <QuantityStepper
                  quantity={currentQty}
                  onIncrement={() => {
                    const rawQty = activeWeightOption?.rawQty ?? (parseFloat(selectedWeight) || 1);
                    const payload = {
                      productId: product.id,
                      price: currentPrice,
                      productQuantity: rawQty,
                      productCount: currentQty + 1,
                    };
                    console.log('🛒 Cart Item:', payload);
                    updateQuantity(product.id, selectedWeight, 1);
                  }}
                  onDecrement={() => {
                    const rawQty = activeWeightOption?.rawQty ?? (parseFloat(selectedWeight) || 1);
                    const payload = {
                      productId: product.id,
                      price: currentPrice,
                      productQuantity: rawQty,
                      productCount: currentQty - 1,
                    };
                    console.log('🛒 Cart Item:', payload);
                    updateQuantity(product.id, selectedWeight, -1);
                  }}
                  size="sm"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const rawQty = activeWeightOption?.rawQty ?? (parseFloat(selectedWeight) || 1);
                    const payload = {
                      productId: product.id,
                      price: currentPrice,
                      productQuantity: rawQty,
                      productCount: 1,
                    };
                    console.log('🛒 Cart Item:', payload);
                    addToCart(product, selectedWeight, currentPrice, currentMrp);
                  }}
                  className="bg-[#00450d] hover:bg-[#1b5e20] text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>{t('product.add')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 10-15 Min Delivery speed card */}
        <div className="bg-[#f0eded] rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shrink-0">
            <Zap size={16} fill="white" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-[#1b1c1c]">
              {t('product.fastDelivery')}
            </p>
            <p className="text-[11px] text-[#525e54]">
              {t('product.fastDeliveryDesc')}
            </p>
          </div>
        </div>

        {/* Weight Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm sm:text-base text-[#1b1c1c]">
              {product.unit === unit.LTR || product.unit === unit.ML
                ? t('product.howMuchVolume')
                : product.unit === unit.PCS || product.unit === unit.PACKET
                ? t('product.howMuchPack')
                : t('product.howMuchWeight')}
            </h3>
            <span className="text-[11px] font-semibold text-[#1b5e20]">
              {product.unit === unit.LTR || product.unit === unit.ML
                ? t('product.netVolume')
                : product.unit === unit.PCS || product.unit === unit.PACKET
                ? t('product.verifiedPack')
                : t('product.netWeight')}
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
            {product.weightOptions.map((opt) => {
              const isSelected = selectedWeight === opt.weight;
              return (
                <button
                  key={opt.weight}
                  type="button"
                  onClick={() => {
                    setSelectedWeight(opt.weight);
                  }}
                  className={`p-2 shrink-0 min-w-[130px] h-15 rounded-xl border text-left transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#a0f399]/30 border-[#1b5e20] ring-1 ring-[#1b5e20] shadow-xs'
                      : 'bg-white border-[#cfd8d0] hover:border-[#1b5e20]/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-[#1b5e20]">
                      <CheckCircle2 size={16} fill="#1b5e20" className="text-white" />
                    </div>
                  )}

                  <div className="font-extrabold text-sm sm:text-base text-[#1b1c1c]">
                    {opt.weight}
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    {opt.cutPrice && opt.cutPrice > 0 ? (
                      <span className="text-xs text-[#8a948c] line-through font-normal">
                        ₹{opt.cutPrice.toLocaleString(currentLocale())}
                      </span>
                    ) : null}
                    <span className="font-black text-sm text-[#00450d]">
                      ₹{opt.price.toLocaleString(currentLocale())}
                    </span>
                  </div>

                 
                </button>
              );
            })}
          </div>
        </div>

        {/* Mandi Bhav Muqabla (Price Match) Card */}
    

        {/* Ghar Ki Rasoi Ke Liye Vishwas (Our Guarantee) */}
        <div className="space-y-2 pt-1">
          <h3 className="font-bold text-sm sm:text-base text-[#1b1c1c]">
            {t('product.guaranteeTitle')}
          </h3>

          <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] space-y-3 shadow-2xs">
            {/* Point 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#a0f399] text-[#00450d] flex items-center justify-center shrink-0 mt-0.5">
                <Check size={14} strokeWidth={3} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#1b1c1c]">
                  {t('product.g1Title')}
                </p>
                <p className="text-[#525e54] text-[11px] mt-0.5">
                  {t('product.g1Desc')}
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#a0f399] text-[#00450d] flex items-center justify-center shrink-0 mt-0.5">
                <Smile size={14} strokeWidth={2.5} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#1b1c1c]">
                  {t('product.g2Title')}
                </p>
                <p className="text-[#525e54] text-[11px] mt-0.5">
                  {t('product.g2Desc')}
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#a0f399] text-[#00450d] flex items-center justify-center shrink-0 mt-0.5">
                <RefreshCw size={14} strokeWidth={2.5} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#1b1c1c]">
                  {t('product.g3Title')}
                </p>
                <p className="text-[#525e54] text-[11px] mt-0.5">
                  {t('product.g3Desc')}
                </p>
              </div>
            </div>

            {/* Point 4 */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#a0f399] text-[#00450d] flex items-center justify-center shrink-0 mt-0.5">
                <Scale size={14} strokeWidth={2.5} />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#1b1c1c]">
                  {t('product.g4Title')}
                </p>
                <p className="text-[#525e54] text-[11px] mt-0.5">
                  {t('product.g4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rasoi Tips & Uses */}
     
        {/* Tadka Saath Mein Liya? (Quick Add) */}
      
      </div>

      {/* Sticky Bottom Bar positioned right above BottomNavigation */}
      <div className="fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/[0.08] p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-[#525e54] font-medium block">
              {t('product.selected', { weight: selectedWeight })}
            </span>
            <div className="flex items-baseline gap-1.5">
              {hasInCart ? null : currentCutPrice && currentCutPrice > 0 ? (
                <span className="text-xs text-[#9eaaa0] line-through font-normal">
                  ₹{currentCutPrice.toLocaleString(currentLocale())}
                </span>
              ) : currentMrp > currentPrice ? (
                <span className="text-xs text-[#9eaaa0] line-through font-normal">
                  ₹{currentMrp.toLocaleString(currentLocale())}
                </span>
              ) : null}
              <span className="text-xl font-black text-[#00450d]">
                ₹{displayPrice.toLocaleString(currentLocale())}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentQty > 0 ? (
              <QuantityStepper
                quantity={currentQty}
                onIncrement={() => {
                  const rawQty = activeWeightOption?.rawQty ?? (parseFloat(selectedWeight) || 1);
                  const payload = {
                    productId: product.id,
                    price: currentPrice,
                    productQuantity: rawQty,
                    productCount: currentQty + 1,
                  };
                  console.log('🛒 Cart Item:', payload);
                  updateQuantity(product.id, selectedWeight, 1);
                }}
                onDecrement={() => {
                  const rawQty = activeWeightOption?.rawQty ?? (parseFloat(selectedWeight) || 1);
                  const payload = {
                    productId: product.id,
                    price: currentPrice,
                    productQuantity: rawQty,
                    productCount: currentQty - 1,
                  };
                  console.log('🛒 Cart Item:', payload);
                  updateQuantity(product.id, selectedWeight, -1);
                }}
                size="lg"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  const rawQty = activeWeightOption?.rawQty ?? (parseFloat(selectedWeight) || 1);
                  const payload = {
                    productId: product.id,
                    price: currentPrice,
                    productQuantity: rawQty,
                    productCount: 1,
                  };
                  console.log('🛒 Cart Item:', payload);
                  addToCart(product, selectedWeight, currentPrice, currentMrp);
                }}
                className="bg-[#00450d] hover:bg-[#1b5e20] text-white font-black text-sm px-2 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>{t('product.addToCart')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCart}
              className="bg-[#e8f5e9] text-[#1b5e20] hover:bg-[#a0f399] font-bold text-xs p-2 rounded-xl transition-colors cursor-pointer"
              title={t('product.viewCart')}
            >
              {t('product.cartButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

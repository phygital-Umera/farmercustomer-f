import React from 'react';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import { useAddToCart } from '@/lib/api and mutation/cart/useCart';

interface FloatingCartDockProps {
  onViewCart: () => void;
}

export const FloatingCartDock: React.FC<FloatingCartDockProps> = ({ onViewCart }) => {
  const { user, isAuthenticated } = useAuthContext();
  const { totalItemCount, finalToPay, items, getApiCartItems } = useCart();
  const { mutate: addToCartApi, isPending } = useAddToCart();
  const navigate = useNavigate();

  if (totalItemCount === 0) return null;

  // Take up to 2 product images or avatars for the stacked icons
  const sampleItems = items.slice(0, 2);

  return (
    <aside aria-label="Cart preview" className="fixed bottom-16 left-0 right-0 z-30 px-3 py-1 mb-2 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-[#00450d] text-white rounded-2xl p-3 shadow-[0_8px_24px_rgba(0,69,13,0.35)] flex items-center justify-between gap-3 border border-emerald-800/40 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Stacked circles */}
            <div className="flex -space-x-2 shrink-0">
              {sampleItems.length > 0 ? (
                sampleItems.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#00450d] bg-white"
                  />
                ))
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-[#00450d]">
                  <ShoppingBag size={14} className="text-white" />
                </div>
              )}
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-extrabold text-[15px] tracking-tight">
                  ₹{finalToPay}
                </span>
                <span className="text-xs text-white/80 font-medium">
                  ({totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'})
                </span>
              </div>
              <div className="text-[11px] text-[#a0f399] font-medium flex items-center gap-1">
                <span>12 mins delivery to your door</span>
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                const cartItems = getApiCartItems();
                const payload = {
                  items: cartItems,
                };
                console.log('🛒 Submitting Cart to API:', payload);
                addToCartApi(payload, {
                  onSuccess: () => {
                    onViewCart();
                  },
                });
              }}
              className="bg-[#a0f399] hover:bg-[#8ee886] disabled:opacity-60 disabled:cursor-not-allowed text-[#00450d] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span>Add Cart</span>
                  <ArrowRight size={15} strokeWidth={2.5} />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate({ to: '/signin' })}
              className="bg-white hover:bg-[#f0f4f0] text-[#00450d] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-1 shrink-0 transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Login to Order</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          )}

        
        </div>
      </div>
    </aside>
  );
};

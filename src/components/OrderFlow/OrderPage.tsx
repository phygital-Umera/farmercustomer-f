import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, MapPin, Package, RotateCw, ShoppingBag, ChevronRight, Zap, Scale } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types/OrderType';

interface OrdersPageProps {
  onBack: () => void;
  onViewOrderDetails: (orderId: string) => void;
  onGoToShop: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onBack,
  onViewOrderDetails,
  onGoToShop,
}) => {
  const { orders, repeatOrder } = useCart();

  return (
    <div className="bg-[#fcf9f8] min-h-screen pb-28">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-[#1b1c1c] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </button>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-[#1b1c1c] tracking-tight">
              Order History
            </h1>
            <p className="text-[11px] text-[#525e54]">
              Aapke pichle sabzi mandi orders
            </p>
          </div>
        </div>

        <span className="bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold px-2.5 py-1 rounded-full border border-[#2e7d32]/20">
          {orders.length} Orders
        </span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-3 space-y-3.5">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center mx-auto mb-3">
              <Package size={32} />
            </div>
            <h2 className="text-base font-bold text-[#1b1c1c]">Abhi tak koi order nahi hai</h2>
            <p className="text-xs text-[#525e54] mt-1 max-w-xs mx-auto">
              Subah 4 AM ki taaza mandi sabziyan 10-15 minute mein apne ghar mangwayein.
            </p>
            <button
              type="button"
              onClick={onGoToShop}
              className="mt-4 bg-[#00450d] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer"
            >
              Sabzi Mandi Dekhein
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const isLive = order.status !== 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#e0e6e0] p-3.5 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-[#e0e6e0]/70">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-[#00450d]">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-[#717a6d]">• {order.placedAt}</span>
                    </div>
                  </div>

                  {/* {isLive ? (
                    <span className="inline-flex items-center gap-1 bg-[#acf4a4] text-[#002203] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                      <Zap size={11} fill="currentColor" />
                      <span>On The Way (12 Mins)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-[#e8f5e9] text-[#1b5e20] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} />
                      <span>Delivered</span>
                    </span>
                  )} */}
                </div>

                {/* Items Thumbnails and Summary */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex -space-x-3 shrink-0">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-11 h-11 rounded-xl object-cover border-2 border-white bg-gray-50 shadow-2xs"
                        />
                      ))}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#1b1c1c] truncate">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                      <p className="text-[11px] text-[#525e54] mt-0.5">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Digital Kaata Passed
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-black text-sm text-[#00450d]">
                      ₹{order.totalPaid}
                    </div>
                    {order.savingsTotal > 0 && (
                      <span className="text-[10px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-1.5 py-0.5 rounded">
                        Bachat ₹{order.savingsTotal}
                      </span>
                    )}
                  </div>
                </div>

                {/* Address info snippet */}
                <div className="bg-[#f9fbf9] rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-[#525e54]">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={12} className="text-[#1b5e20] shrink-0" />
                    <span className="truncate">{order.deliveryAddress.flat}, {order.deliveryAddress.city}</span>
                  </div>
                  <span className="font-semibold text-[#1b1c1c] uppercase shrink-0">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                  </span>
                </div>

                {/* Actions: View More / Order Details Button and Repeat Order */}
                <div className="pt-2 border-t border-[#e0e6e0]/70 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => repeatOrder(order)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e20] hover:bg-[#e8f5e9] px-3 py-1.5 rounded-lg border border-[#2e7d32]/30 transition-colors cursor-pointer"
                  >
                    <RotateCw size={13} />
                    <span>Repeat Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewOrderDetails(order.id)}
                    className="flex items-center gap-1 bg-[#00450d] hover:bg-[#1b5e20] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-transform active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <span>View More</span>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

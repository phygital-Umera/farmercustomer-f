import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  RotateCw,
  Scale,
  ShieldCheck,
  Zap,
  Leaf,
  Receipt,
  FileText,
  HelpCircle,
  Bell,
  DoorOpen,
  VolumeX,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types/OrderType';

interface OrderDetailsPageProps {
  orderId: string;
  onBack: () => void;
  onRepeatOrder: (order: Order) => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  orderId,
  onBack,
  onRepeatOrder,
}) => {
  const { getOrderById } = useCart();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showHelpAlert, setShowHelpAlert] = useState(false);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="bg-[#fcf9f8] min-h-screen px-4 pt-10 text-center">
        <h2 className="text-lg font-bold text-[#1b1c1c]">Order Not Found</h2>
        <p className="text-xs text-[#525e54] mt-1">Yeh order ID exist nahi karti.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 bg-[#00450d] text-white font-bold text-xs px-4 py-2 rounded-xl"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const isLive = order.status !== 'delivered';

  const handleDownloadInvoice = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const getInstructionLabel = () => {
    switch (order.deliveryInstruction) {
      case 'ring_bell':
        return { label: 'Ring Bell / Ghanti Bajayein', icon: <Bell size={14} className="text-amber-500" /> };
      case 'leave_door':
        return { label: 'Leave at Door / Darwaze Par', icon: <DoorOpen size={14} className="text-amber-800" /> };
      case 'do_not_ring':
        return { label: 'Do Not Ring / Ghanti Mat Bajayein', icon: <VolumeX size={14} className="text-amber-600" /> };
      default:
        return { label: 'Standard Delivery', icon: <Bell size={14} /> };
    }
  };

  const instructionInfo = getInstructionLabel();

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
              Order Details
            </h1>
            <p className="text-[11px] text-[#525e54]">
              {order.id} • {order.placedAt}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHelpAlert(true)}
          className="p-1.5 text-[#525e54] hover:text-[#00450d] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          title="Mandi Help"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Status Tracker Banner */}
        <div className="bg-white rounded-2xl p-4 border border-[#e0e6e0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-black text-[#525e54] tracking-wider">
                Current Status
              </span>
              <h2 className="text-base font-extrabold text-[#1b1c1c] mt-0.5">
                {isLive ? 'Rider On The Way (10-15 Mins)' : 'Order Successfully Delivered'}
              </h2>
            </div>
            {isLive ? (
              <span className="w-8 h-8 rounded-full bg-[#a0f399] text-[#00450d] flex items-center justify-center animate-pulse">
                <Zap size={18} fill="#00450d" />
              </span>
            ) : (
              <span className="w-8 h-8 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center">
                <CheckCircle2 size={20} />
              </span>
            )}
          </div>

          {/* Stepper Timeline */}
          <div className="pt-2 border-t border-[#e0e6e0]/60 space-y-2.5">
            <div className="flex items-center gap-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-[#00450d] text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1b1c1c]">Order Placed &amp; Confirmed</p>
                <p className="text-[10px] text-[#717a6d]">{order.placedAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-[#00450d] text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1b1c1c]">Digital Kaata Certified Weighing</p>
                <p className="text-[10px] text-[#717a6d]">Dandi-free digital weigh verified</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isLive ? 'bg-[#a0f399] text-[#00450d] animate-bounce' : 'bg-[#00450d] text-white'
                }`}
              >
                {isLive ? '🛵' : '✓'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1b1c1c]">Out for Delivery</p>
                <p className="text-[10px] text-[#717a6d]">
                  Rider: {order.riderName || 'Santosh Kumar'} {order.riderPhone && `(${order.riderPhone})`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isLive ? 'bg-gray-200 text-gray-500' : 'bg-[#00450d] text-white'
                }`}
              >
                {isLive ? '4' : '✓'}
              </div>
              <div className="flex-1">
                <p className={`font-bold ${isLive ? 'text-gray-400' : 'text-[#1b1c1c]'}`}>
                  Ghar Par Delivery (Doorstep)
                </p>
                <p className="text-[10px] text-[#717a6d]">
                  {isLive ? '10-15 minute window' : 'Delivered on time'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* All Items in This Order */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base text-[#1b1c1c]">
              Ordered Items ({order.items.length})
            </h3>
            <span className="text-[11px] font-semibold text-[#1b5e20] flex items-center gap-1">
              <Scale size={12} /> Digital Kaata Verified
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#e0e6e0] divide-y divide-[#e0e6e0] overflow-hidden shadow-2xs">
            {order.items.map((item, idx) => (
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
                      {item.weight} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-sm text-[#00450d]">
                    {item.price === 0 ? 'FREE' : `₹${item.price}`}
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

        {/* Delivery Address & Instructions */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-3">
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="text-[#1b5e20] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[#1b1c1c]">{order.deliveryAddress.label}</p>
              <p className="text-[#1b1c1c] font-semibold mt-0.5">{order.deliveryAddress.flat}</p>
              <p className="text-[#525e54] text-[11px]">
                {order.deliveryAddress.landmark}, {order.deliveryAddress.city} {order.deliveryAddress.pincode}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e0e6e0]/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#525e54]">
              {instructionInfo.icon}
              <span className="font-medium">{instructionInfo.label}</span>
            </div>
            <span className="font-bold text-[#1b5e20] bg-[#e8f5e9] px-2 py-0.5 rounded">
              Verified
            </span>
          </div>
        </div>

        {/* Saaf Hisaab / Complete Bill Breakdown */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#e0e6e0]">
            <div className="flex items-center gap-1.5">
              <Receipt size={16} className="text-[#1b5e20]" />
              <h3 className="font-extrabold text-sm text-[#1b1c1c]">
                Saaf Hisaab / Bill Breakdown
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#525e54] uppercase">
              Paid via {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#525e54]">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-[#1b1c1c]">₹{order.itemsTotal}</span>
            </div>
            <div className="flex justify-between text-[#1b5e20]">
              <span className="flex items-center gap-1">
                <Leaf size={12} /> Mandi Fresh Discount
              </span>
              <span className="font-bold">-₹{order.discountTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge (Ghar Pahuchana)</span>
              <span className="font-bold text-[#1b5e20]">
                {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Packing &amp; Digital Weighing</span>
              <span className="font-bold text-[#1b5e20]">₹0 (Muft)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e0e6e0] flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-[#1b1c1c] block">
                Total Amount Paid
              </span>
              <span className="text-[11px] text-[#1b5e20] font-bold">
                Aapki Bachat: ₹{order.savingsTotal} Saved 🎉
              </span>
            </div>
            <span className="text-xl font-black text-[#00450d]">
              ₹{order.totalPaid}
            </span>
          </div>
        </div>

        {/* Action Buttons: Repeat Order & Download Invoice */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => onRepeatOrder(order)}
            className="w-full bg-[#00450d] hover:bg-[#1b5e20] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer"
          >
            <RotateCw size={16} />
            <span>Repeat This Order</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="w-full bg-white hover:bg-[#f9fbf9] text-[#1b1c1c] font-bold py-2.5 rounded-xl border border-[#e0e6e0] flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
          >
            <FileText size={15} className="text-[#1b5e20]" />
            <span>{downloadSuccess ? 'Bill Downloaded ✓' : 'Download Mandi Tax Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Help Alert Modal */}
      {showHelpAlert && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4"
          onClick={() => setShowHelpAlert(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xs w-full p-5 text-center space-y-3 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center mx-auto">
              <Phone size={22} />
            </div>
            <h3 className="font-bold text-base text-[#1b1c1c]">Apna Mandi Support</h3>
            <p className="text-xs text-[#525e54]">
              Order #{order.id} ke regarding koi bhi sawaal ho toh humare mandi helpline par turant call karein:
            </p>
            <div className="bg-[#f0eded] rounded-xl p-2.5 font-bold text-xs text-[#00450d]">
              Helpline: 1800-419-MANDI (Toll Free)
            </div>
            <button
              type="button"
              onClick={() => setShowHelpAlert(false)}
              className="w-full bg-[#00450d] text-white font-bold py-2 rounded-xl text-xs"
            >
              Theek Hai / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

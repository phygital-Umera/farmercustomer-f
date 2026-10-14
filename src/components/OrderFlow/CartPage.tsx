import React, { useState } from 'react';
import {
  ArrowLeft,
  Zap,
  Gift,
  Leaf,
  Bell,
  DoorOpen,
  VolumeX,
  ShieldCheck,
  RotateCcw,
  Scale,
  Receipt,
  Banknote,
  QrCode,
  CreditCard,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

import { QuantityStepper } from './QuantityStepper';

import { SearchBar } from './SearchBar';
import { useCart } from '@/context/CartContext';
import { DeliveryInstruction, PaymentMethod } from '@/types/OrderType';

interface CartPageProps {
  onBack: () => void;
  onOpenAddressModal: () => void;
  onPlaceOrder: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onBack,
  onOpenAddressModal,
  onPlaceOrder,
}) => {
  const {
    items,
    updateQuantity,
    totalItemCount,
    itemsTotal,
    discountTotal,
    deliveryCharge,
    packagingCharge,
    finalToPay,
    savingsTotal,
    deliveryInstruction,
    setDeliveryInstruction,
    paymentMethod,
    setPaymentMethod,
    address,
    hasFreeGift,
  } = useCart();

  const [showBillDetailModal, setShowBillDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const instructions: {
    id: DeliveryInstruction;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'ring_bell',
      title: 'Ring Bell',
      subtitle: 'Ghanti Bajayein',
      icon: <Bell size={20} className="text-amber-500" />,
    },
    {
      id: 'leave_door',
      title: 'Leave at Door',
      subtitle: 'Darwaze Par',
      icon: <DoorOpen size={20} className="text-amber-800" />,
    },
    {
      id: 'do_not_ring',
      title: 'Do Not Ring',
      subtitle: 'Ghanti Mat Bajayein',
      icon: <VolumeX size={20} className="text-amber-600" />,
    },
  ];

  const paymentOptions: {
    id: PaymentMethod;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'cod',
      title: 'Cash on Delivery (COD)',
      description: 'Sabzi dekh kar delivery wale ko cash dein',
      icon: <Banknote size={20} className="text-[#1b5e20]" />,
    },
    {
      id: 'upi',
      title: 'UPI (Google Pay / PhonePe / Paytm)',
      description: 'Instant scan ya UPI ID se pay karein',
      icon: <QrCode size={20} className="text-[#1b5e20]" />,
    },
    {
      id: 'card',
      title: 'Debit / ATM / Credit Card',
      description: 'Visa, RuPay, Mastercard sab chalenge',
      icon: <CreditCard size={20} className="text-[#1b5e20]" />,
    },
  ];

  if (items.length === 0) {
    return (
      <div className="bg-[#fcf9f8] min-h-screen px-4 pt-4 pb-28 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#1b5e20] mb-4">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-bold text-[#1b1c1c]">Aapka Thela Khali Hai!</h2>
        <p className="text-xs text-[#525e54] mt-1 max-w-xs">
          Subah ki taza sabziyan mandi se seedhe ghar mangwayein.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 bg-[#00450d] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow cursor-pointer"
        >
          Sabzi Mandi Dekhein
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f8] min-h-screen pb-44">
      {/* Search Header Container matching Screenshot 1 */}
      <div className="px-4 pt-2 pb-2 bg-[#fcf9f8]">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Cart Sub-Header: Back & 100% Taaza Guarantee */}
      <div className="px-4 py-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-base font-bold text-[#1b1c1c] hover:text-[#00450d] transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Back</span>
        </button>

      </div>

      <div className="max-w-md mx-auto px-4 space-y-4 pt-1">
        {/* Title & Count */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-[#00450d] tracking-tight">
            Aapka Thela <span className="text-sm font-semibold text-[#525e54]">/ Your Cart</span>
          </h1>
          <span className="bg-[#e5e2e1] text-[#1b1c1c] text-xs font-bold px-2.5 py-1 rounded-md">
            {totalItemCount} Items
          </span>
        </div>

        {/* Delivery Address Card matching Screenshot 1 */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-2">
    

          <div className="text-xs text-[#1b1c1c] font-medium pt-1">
            <p className="font-bold text-sm text-[#1b1c1c]">
              {address.flat}
            </p>
            <p className="text-[#525e54] text-[11px]">
              {address.landmark}, {address.city} {address.pincode}
            </p>
          </div>
        </div>

        {/* Mandi Shagun Freebie Card matching Screenshot 1 */}
      

        {/* Chuni Hui Sabziyan (Selected Veggies) List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm sm:text-base text-[#1b1c1c]">
              Chuni Hui Sabziyan <span className="text-xs font-medium text-[#525e54]">(Selected Veggies)</span>
            </h3>
            <span className="text-[11px] font-semibold text-[#1b5e20] flex items-center gap-1">
              <Leaf size={11} /> Directly from Mandi
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#e0e6e0] divide-y divide-[#e0e6e0] overflow-hidden shadow-2xs">
            {items.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              const itemMrpTotal = item.unitMrp * item.quantity;
              const diff = itemMrpTotal - itemTotal;

              return (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-black/5 shrink-0"
                    />

                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1b1c1c] leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#525e54] font-medium">
                        Vazan: {item.selectedWeight}
                      </p>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="font-black text-sm text-[#00450d]">
                          ₹{itemTotal}
                        </span>
                   
                        {diff > 0 ? (
                          <span className="text-[10px] text-[#2e7d32] font-extrabold">
                            ₹{diff} OFF
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#1b5e20] font-bold">
                            Subah Ki Taaza
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <QuantityStepper
                    quantity={item.quantity}
                    onIncrement={() =>
                      updateQuantity(item.product.id, item.selectedWeight, 1)
                    }
                    onDecrement={() =>
                      updateQuantity(item.product.id, item.selectedWeight, -1)
                    }
                    size="md"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Hidayat / Instructions matching Screenshot 1 */}
        

        {/* Saaf Hisaab / Bill Details matching Screenshot 1 */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#e0e6e0]">
            <div className="flex items-center gap-1.5">
              <Receipt size={16} className="text-[#1b5e20]" />
              <h3 className="font-extrabold text-sm text-[#1b1c1c]">
                 Bill Details
              </h3>
            </div>
            <span className="bg-[#a0f399] text-[#00450d] text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
              No Hidden Charges
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#525e54]">
            <div className="flex justify-between">
              <span>Total Items Price ({totalItemCount} Chizein)</span>
              <span className="font-bold text-[#1b1c1c]">₹{itemsTotal}</span>
            </div>

           

            <div className="flex justify-between">
              <div>
                <span>Delivery Charge (Ghar Pahuchana)</span>
                <p className="text-[10px] text-[#2e7d32]">Free for orders above ₹49</p>
              </div>
              <span className="font-bold text-[#1b5e20]">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>

           
          </div>

          <div className="pt-2 border-t border-[#e0e6e0] flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-[#1b1c1c] block">
                Kul Rakam / To Pay
              </span>
            
            </div>
            <span className="text-xl font-black text-[#00450d]">
              ₹{finalToPay}
            </span>
          </div>
        </div>

        {/* Payment Kaise Karenge? / Pay Method matching Screenshot 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">💳</span>
            <h3 className="font-extrabold text-sm sm:text-base text-[#1b1c1c]">
              Payment Kaise Karenge? <span className="text-xs font-normal text-[#525e54]">/ Pay Method</span>
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-[#e0e6e0] overflow-hidden divide-y divide-[#e0e6e0] shadow-2xs">
            {paymentOptions.map((opt) => {
              const isSelected = paymentMethod === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#e8f5e9]/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Custom Radio Button */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#00450d] bg-[#00450d]'
                          : 'border-[#717a6d] bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[#1b1c1c]">
                        {opt.title}
                      </p>
                      <p className="text-[11px] text-[#525e54]">
                        {opt.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">{opt.icon}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Digital Kaata & Return Guarantee Badges matching Screenshot 1 */}
      
      </div>

      {/* Sticky Bottom Order Bar matching Screenshot 1 */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-black/[0.08] p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Bill summary toggle on left */}
          <button
            type="button"
            onClick={() => setShowBillDetailModal(!showBillDetailModal)}
            className="flex flex-col text-left cursor-pointer group"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#00450d]">
                ₹{finalToPay}
              </span>
              <span className="text-xs text-[#9eaaa0] line-through">
                ₹{itemsTotal}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#1b5e20] flex items-center gap-0.5 group-hover:underline">
              Bill Dekhein {showBillDetailModal ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </span>
          </button>

          {/* Place Order CTA Button */}
          <button
            type="button"
            onClick={onPlaceOrder}
            className="bg-[#00450d] hover:bg-[#1b5e20] text-white px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 flex-1 max-w-[240px] transition-transform active:scale-95 shadow-md cursor-pointer"
          >
            <div className="text-left leading-tight min-w-0">
              <span className="block text-xs font-black tracking-wider uppercase truncate">
                ORDER KAREIN
              </span>
              <span className="block text-[10px] text-white/80 capitalize font-medium truncate">
                {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-1 font-bold text-xs bg-white/20 px-2 py-1.5 rounded-lg shrink-0">
              <span>Place</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>

      {/* Bill Details Bottom Sheet Modal */}
      {showBillDetailModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-end justify-center p-0"
          onClick={() => setShowBillDetailModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl max-w-md w-full p-5 space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto" />
            <h3 className="font-extrabold text-base text-[#1b1c1c]">
              Complete Bill Breakdown
            </h3>

            <div className="space-y-2 text-sm text-[#525e54]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#1b1c1c]">₹{itemsTotal}</span>
              </div>
             
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#1b5e20]">FREE</span>
              </div>
           
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-[#00450d]">
                <span>Total Amount to Pay</span>
                <span>₹{finalToPay}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBillDetailModal(false)}
              className="w-full bg-[#00450d] text-white font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Theek Hai / OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Receipt,
  Banknote,
  QrCode,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { QuantityStepper } from './QuantityStepper';
import { SearchBar } from './SearchBar';
import { useCart } from '@/context/CartContext';
import { PaymentMethod } from '@/types/OrderType';
import { useGetCart, useChangeCount } from '@/lib/api and mutation/cart/useCart';
import { useOrderItem } from '@/lib/api and mutation/Order/useOrder';
import { useGetAddress } from '@/lib/api and mutation/Order/useAdress';
import { useNavigate } from '@tanstack/react-router';

interface CartPageProps {
  onBack: () => void;
  onOpenAddressModal: () => void;
  onPlaceOrder: () => void;
}

interface DisplayCartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  weightLabel: string;
  productQuantity: number;
  price: number;
  count: number;
}

export const CartPage: React.FC<CartPageProps> = ({
  onBack,
  onOpenAddressModal,
  onPlaceOrder,
}) => {
  const {
    items,
    address,
    setAddress,
    paymentMethod,
    setPaymentMethod,
    updateQuantity,
  } = useCart();

  const { mutate: placeOrder, isPending } = useOrderItem();
  const { data: getadress } = useGetAddress();

  const navigate = useNavigate();

  const addressList = useMemo(() => {
    if (!getadress) return [];
    const resData = (getadress as any)?.data;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(getadress)) return getadress;
    return [];
  }, [getadress]);

  const [addressId, setAddressId] = useState<string>('');

  // Sync selected addressId with context or first available address
  useEffect(() => {
    if (!addressId) {
      if (address?.id && addressList.some((item: any) => item.id === address.id)) {
        setAddressId(address.id);
      } else if (addressList.length > 0) {
        const first = addressList[0];
        setAddressId(first.id);
        setAddress({
          id: first.id,
          label: 'Saved Address',
          flat: first.address,
          landmark: first.landmark,
          pincode: first.pincode,
          city: (first as any).city || address.city || '',
          contactNo: first.contactNo,
        });
      }
    } else if (address?.id && address.id !== addressId) {
      setAddressId(address.id);
    }
  }, [addressList, address?.id]);

  const selectedAddress = useMemo(() => {
    if (addressId) {
      const found = addressList.find((item: any) => item.id === addressId);
      if (found) return found;
    }
    if (address?.flat) {
      return {
        id: address.id || addressId,
        address: address.flat,
        landmark: address.landmark,
        pincode: address.pincode,
        contactNo: address.contactNo,
      };
    }
    return addressList[0] || null;
  }, [addressId, addressList, address]);

  const handlePlaceOrder = () => {
    const finalAddressId = addressId || selectedAddress?.id || address?.id;
    if (!finalAddressId) {
      toast.error('Kripya delivery address chuniye (Please select delivery address)');
      onOpenAddressModal();
      return;
    }

    placeOrder(
      { addressId: finalAddressId },
      {
        onSuccess: () => {
          // Ask for feedback once, right after billing (read on the Orders page)
          try {
            sessionStorage.setItem('show_feedback_after_order', '1');
          } catch {
            /* storage unavailable — skip the prompt */
          }
         navigate({to:'/orders'})
        },
      }
    );
  };


  const [showBillDetailModal, setShowBillDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantityOverrides, setQuantityOverrides] = useState<Record<string, number>>({});

  const { data: cartData } = useGetCart();
  const { mutate: changeItemCount } = useChangeCount();

  const backendCart = cartData?.data || cartData;
  const backendItems = Array.isArray(backendCart?.items) ? backendCart.items : [];

  // Map backend items or fallback to local context items
  const rawDisplayItems: DisplayCartItem[] = useMemo(() => {
    if (backendItems.length > 0) {
      return backendItems.map((item: any) => {
        const unitLabel =
          item.unit === 'GRAM' ? 'g' : item.unit === 'KG' ? 'kg' : (item.unit || '').toLowerCase();
        const weightLabel = `${item.productQuantity} ${unitLabel}`.trim();
        const count =
          quantityOverrides[item.id] !== undefined ? quantityOverrides[item.id] : item.productCount;
        return {
          id: item.id || item.productId,
          productId: item.productId,
          name: item.name || '',
          image: item.images?.[0] || '',
          weightLabel: weightLabel || '1 unit',
          productQuantity: item.productQuantity,
          price: Number(item.price) || 0,
          count: count,
        };
      });
    }

    return items.map((item) => {
      const key = `${item.product.id}-${item.selectedWeight}`;
      const count =
        quantityOverrides[key] !== undefined ? quantityOverrides[key] : item.quantity;
      const option = item.product.weightOptions.find((w) => w.weight === item.selectedWeight);
      const productQuantity = option?.rawQty ?? (parseFloat(item.selectedWeight) || 1);
      return {
        id: key,
        productId: item.product.id,
        name: item.product.name,
        image: item.product.image,
        weightLabel: item.selectedWeight,
        productQuantity: productQuantity,
        price: item.unitPrice,
        count: count,
      };
    });
  }, [backendItems, items, quantityOverrides]);

  // Filter out items with 0 count
  const activeDisplayItems = useMemo(() => {
    return rawDisplayItems.filter((i) => i.count > 0);
  }, [rawDisplayItems]);

  const filteredDisplayItems = useMemo(() => {
    if (!searchQuery.trim()) return activeDisplayItems;
    const q = searchQuery.toLowerCase().trim();
    return activeDisplayItems.filter((i) => i.name.toLowerCase().includes(q));
  }, [activeDisplayItems, searchQuery]);

  // Derived financial & count totals with local quantity overrides
  const displayTotalCount = useMemo(() => {
    return activeDisplayItems.reduce((acc, i) => acc + i.count, 0);
  }, [activeDisplayItems]);

  const displayItemsTotal = useMemo(() => {
    return activeDisplayItems.reduce((acc, i) => acc + i.price * i.count, 0);
  }, [activeDisplayItems]);

  // Bill amounts are displayed with exactly 3 decimals
  const fmt3 = (n: number) => n.toFixed(3);

  const displayDeliveryCharge = 0;
  const displayFinalToPay = displayItemsTotal;

  // Handle quantity changes with useChangeCount API
  const handleQuantityChange = (item: DisplayCartItem, nextCount: number) => {
    // 1. Optimistic local update for instant snappy UI
    setQuantityOverrides((prev) => ({
      ...prev,
      [item.id]: nextCount,
    }));

    if (updateQuantity) {
      updateQuantity(item.productId, item.weightLabel, nextCount - item.count);
    }

    // 2. Call changeCount API if backend item exists
    const isBackendItem = backendItems.some((bi: any) => bi.id === item.id);
    if (isBackendItem) {
      const payload = {
        price: item.price,
        count: nextCount,
        productCount: nextCount,
        productQuantity: item.productQuantity,
      };
      console.log('🔄 Calling changeCount API:', { id: item.id, data: payload });
      changeItemCount(
        { id: item.id, data: payload },
        {
          onError: () => {
            // Revert back if API fails
            setQuantityOverrides((prev) => ({
              ...prev,
              [item.id]: item.count,
            }));
          },
        }
      );
    }
  };

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
  ];

  if (activeDisplayItems.length === 0) {
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
      {/* Search Header Container */}
      <div className="px-4 pt-2 pb-2 bg-[#fcf9f8]">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="max-w-md mx-auto px-4 space-y-2 ">
        {/* Title, Back Button & Item Count in the same line */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-sm sm:text-base font-bold text-[#1b1c1c] hover:text-[#00450d] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            <h1 className="text-base sm:text-xl font-black text-[#00450d] tracking-tight truncate">
              Aapka Thela <span className="text-xs sm:text-sm font-semibold text-[#525e54]"></span>
            </h1>
          </div>

          
        </div>

        {/* Delivery Address Card */}
        <div className="bg-white rounded-2xl p-2.5 border border-[#e0e6e0] hover:border-[#1b5e20] transition-colors shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#1b5e20] uppercase tracking-wider flex items-center gap-1">
              <MapPin size={13} />
              Delivery Address
            </span>
            <button
              type="button"
              onClick={onOpenAddressModal}
              className="text-xs font-bold text-[#00450d] hover:underline cursor-pointer"
            >
              Change / Add
            </button>
          </div>

          {/* Quick Select Tabs if user has multiple saved addresses */}
          {addressList.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {addressList.map((item: any, idx: number) => {
                const isSelected = (addressId || selectedAddress?.id) === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAddressId(item.id);
                      setAddress({
                        id: item.id,
                        label: `Address ${idx + 1}`,
                        flat: item.address,
                        landmark: item.landmark,
                        pincode: item.pincode,
                        city: (item as any).city || address.city || '',
                        contactNo: item.contactNo,
                      });
                    }}
                    className={`px-1 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'bg-[#00450d] text-white border-[#00450d]'
                        : 'bg-[#f9fbf9] text-[#525e54] border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Address {idx + 1}
                  </button>
                );
              })}
            </div>
          )}

          {selectedAddress ? (
            <div
              onClick={onOpenAddressModal}
              className="text-xs text-[#1b1c1c] font-medium pt-0.5 cursor-pointer"
            >
              <p className="font-bold text-sm text-[#1b1c1c]">
                {selectedAddress.address}
              </p>
              <p className="text-[#525e54] text-[11px]">
                {selectedAddress.landmark ? `${selectedAddress.landmark}, ` : ''}{selectedAddress.pincode}
              </p>
              {selectedAddress.contactNo && (
                <p className="text-[#1b5e20] text-[11px] font-semibold mt-1">
                  Contact: {selectedAddress.contactNo}
                </p>
              )}
            </div>
          ) : (
            <div
              onClick={onOpenAddressModal}
              className="text-xs text-[#525e54] py-2 cursor-pointer text-center border border-dashed border-gray-300 rounded-xl hover:border-[#1b5e20] transition-colors"
            >
              <p className="font-semibold text-[#00450d]">+ Select or Add Delivery Address</p>
            </div>
          )}
        </div>

        {/* Selected Items List - Clean, minimal layout */}
        <div>
          <div className="bg-white rounded-2xl border border-[#e0e6e0] divide-y divide-[#e0e6e0] overflow-hidden shadow-2xs">
            {filteredDisplayItems.map((item) => {
              const itemTotal = item.price * item.count;

              return (
                <div
                  key={item.id}
                  className="p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-black/5 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#e8f5e9] flex items-center justify-center text-[#1b5e20] font-black text-xs uppercase shrink-0">
                        {item.name?.slice(0, 3)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-[#1b1c1c] leading-snug truncate capitalize">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#525e54] font-medium mt-0.5">
                        Vazan: {item.weightLabel}
                      </p>
                      <div className="mt-1">
                        <span className="font-black text-sm text-[#00450d]">
                          ₹{itemTotal}
                        </span>
                      </div>
                    </div>
                  </div>

                  <QuantityStepper
                    quantity={item.count}
                    onIncrement={() => {
                      handleQuantityChange(item, item.count + 1);
                    }}
                    onDecrement={() => {
                      const nextCount = Math.max(0, item.count - 1);
                      handleQuantityChange(item, nextCount);
                    }}
                    size="md"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bill Details */}
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
              <span>Total Items Price ({displayTotalCount} {displayTotalCount === 1 ? 'Chiz' : 'Chizein'})</span>
              <span className="font-bold text-[#1b1c1c]">₹{fmt3(displayItemsTotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-bold text-[#1b5e20]">FREE</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#e0e6e0] flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-[#1b1c1c] block">
                Kul Rakam / To Pay
              </span>
            </div>
            <span className="text-xl font-black text-[#00450d]">
              ₹{fmt3(displayFinalToPay)}
            </span>
          </div>
        </div>

        {/* Payment Options */}
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
      </div>

      {/* Sticky Bottom Order Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-black/[0.08] p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowBillDetailModal(!showBillDetailModal)}
            className="flex flex-col text-left cursor-pointer group"
          >
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#00450d]">
                ₹{fmt3(displayFinalToPay)}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#1b5e20] flex items-center gap-0.5 group-hover:underline">
              Bill Dekhein {showBillDetailModal ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </span>
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={handlePlaceOrder}
            className="bg-[#00450d] hover:bg-[#1b5e20] disabled:opacity-60 text-white px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 flex-1 max-w-[240px] transition-transform active:scale-95 shadow-md cursor-pointer"
          >
            <div className="text-left leading-tight min-w-0">
              <span className="block text-xs font-black tracking-wider uppercase truncate">
                {isPending ? 'PLACING...' : 'ORDER KAREIN'}
              </span>
              <span className="block text-[10px] text-white/80 capitalize font-medium truncate">
                {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-1 font-bold text-xs bg-white/20 px-2 py-1.5 rounded-lg shrink-0">
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>Place</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </>
              )}
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
                <span className="font-bold text-[#1b1c1c]">₹{fmt3(displayItemsTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#1b5e20]">FREE</span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-[#00450d]">
                <span>Total Amount to Pay</span>
                <span>₹{fmt3(displayFinalToPay)}</span>
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

import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useGetCart, useChangeCount } from '@/lib/api and mutation/cart/useCart';
import { useOrderItem } from '@/lib/api and mutation/Order/useOrder';
import { useGetAddress } from '@/lib/api and mutation/Order/useAdress';
import { DisplayCartItem, SelectedAddressData } from './types';

interface UseCartPageDataProps {
  onOpenAddressModal: () => void;
}

export const useCartPageData = ({ onOpenAddressModal }: UseCartPageDataProps) => {
  const {
    items,
    address,
    setAddress,
    paymentMethod,
    setPaymentMethod,
    updateQuantity,
  } = useCart();

  const { mutate: placeOrder, isPending } = useOrderItem();
  const { t } = useTranslation();
  const { data: getadress } = useGetAddress();
  const navigate = useNavigate();

  const [addressId, setAddressId] = useState<string>('');
  const [showBillDetailModal, setShowBillDetailModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantityOverrides, setQuantityOverrides] = useState<Record<string, number>>({});

  const { data: cartData } = useGetCart();
  const { mutate: changeItemCount } = useChangeCount();

  const addressList = useMemo(() => {
    if (!getadress) return [];
    const resData = (getadress as any)?.data;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(getadress)) return getadress;
    return [];
  }, [getadress]);

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

  const selectedAddress: SelectedAddressData | null = useMemo(() => {
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

  const handleSelectAddress = (item: any, idx: number) => {
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
  };

  const handlePlaceOrder = () => {
    const finalAddressId = addressId || selectedAddress?.id || address?.id;
    if (!finalAddressId) {
      toast.error(t('toast.selectAddress'));
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
          navigate({ to: '/orders' });
        },
      }
    );
  };

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

  return {
    addressList,
    selectedAddress,
    addressId,
    handleSelectAddress,
    handlePlaceOrder,
    isPending,
    searchQuery,
    setSearchQuery,
    activeDisplayItems,
    filteredDisplayItems,
    displayTotalCount,
    displayItemsTotal,
    displayFinalToPay,
    handleQuantityChange,
    paymentMethod,
    setPaymentMethod,
    showBillDetailModal,
    setShowBillDetailModal,
    showUpiModal,
    setShowUpiModal,
  };
};

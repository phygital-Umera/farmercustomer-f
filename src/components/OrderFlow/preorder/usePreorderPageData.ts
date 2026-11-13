import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { currentLocale } from '@/i18n';
import { useAuthContext } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useGetAllProducts } from '@/lib/api and mutation/product/useProductApi';
import { useGetAddress } from '@/lib/api and mutation/Order/useAdress';
import { useCreatePreorder } from '@/lib/api and mutation/Preorder/usePreorder';
import { mapApiProductToProduct } from '@/utils/productMapper';
import { PreorderItem, Product } from '@/types/OrderType';
import { toIsoDate, qtyKey } from './types';

const formatTimeLabel = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d.toLocaleTimeString(currentLocale(), {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDateLabel = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString(currentLocale(), { day: 'numeric', month: 'short' });
};

export const usePreorderPageData = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthContext();
  const { address, setAddress } = useCart();
  const { data: productsData, isLoading: productsLoading } = useGetAllProducts();
  const { data: getadress } = useGetAddress();
  const { mutate: savePreorder, isPending: isSaving } = useCreatePreorder();

  const todayIso = useMemo(() => toIsoDate(new Date()), []);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const products: Product[] = useMemo(() => {
    const raw = productsData as any;
    const apiList =
      raw?.data?.products ||
      raw?.products ||
      (Array.isArray(raw?.data) ? raw.data : []);
    return Array.isArray(apiList) ? apiList.map(mapApiProductToProduct) : [];
  }, [productsData]);

  // ---------- Address: same behaviour as the Cart page ----------
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
      if (
        address?.id &&
        addressList.some((item: any) => item.id === address.id)
      ) {
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
  }, [addressList, address?.id, address, setAddress]);

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

  // ---------- Products & quantities ----------
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q)),
    );
  }, [products, searchQuery]);

  // Price is recorded per line for the API
  const lineItems: PreorderItem[] = useMemo(() => {
    const lines: PreorderItem[] = [];
    products.forEach((p) => {
      p.weightOptions.forEach((w) => {
        const count = quantities[qtyKey(p.id, w.weight)] || 0;
        if (count > 0) {
          lines.push({
            productId: p.id,
            name: p.name,
            image: p.image,
            weight: w.weight,
            productQuantity: w.rawQty ?? (parseFloat(w.weight) || 1),
            unit: p.unit,
            price: w.price,
            count,
          });
        }
      });
    });
    return lines;
  }, [products, quantities]);

  const totalCount = lineItems.reduce((s, i) => s + i.count, 0);

  const scheduleChosen = Boolean(deliveryDate && deliveryTime);
  const isFuture =
    scheduleChosen && new Date(`${deliveryDate}T${deliveryTime}`) > new Date();
  const canSave =
    isFuture && Boolean(selectedAddress?.id) && totalCount > 0 && !isSaving;

  const hint = !scheduleChosen
    ? t('preorder.hintSchedule')
    : !isFuture
      ? t('preorder.hintFuture')
      : !selectedAddress
        ? t('preorder.hintAddress')
        : totalCount === 0
          ? t('preorder.hintItems')
          : `${formatDateLabel(deliveryDate)}, ${formatTimeLabel(deliveryTime)}`;

  const changeQty = (productId: string, weight: string, delta: number) => {
    const key = qtyKey(productId, weight);
    setQuantities((prev) => {
      const next = Math.max(0, (prev[key] || 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });
  };

  const handleSelectWeight = (productId: string, weight: string) => {
    setSelectedWeights((prev) => ({
      ...prev,
      [productId]: weight,
    }));
  };

  const handleSave = () => {
    if (!canSave || !selectedAddress) return;
    savePreorder(
      {
        addressId: selectedAddress.id,
        preOrderDate: deliveryDate,
        preOrderTime: deliveryTime,
        items: lineItems.map((i) => ({
          productId: i.productId,
          productQuantity: i.productQuantity,
          productCount: i.count,
          price: i.price,
        })),
      },
      { onSuccess: () => navigate({ to: '/orders' }) },
    );
  };

  return {
    isAuthenticated,
    todayIso,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    scheduleChosen,
    isFuture,
    showAddressModal,
    setShowAddressModal,
    addressList,
    selectedAddress,
    addressId,
    handleSelectAddress,
    searchQuery,
    setSearchQuery,
    productsLoading,
    filteredProducts,
    selectedWeights,
    handleSelectWeight,
    quantities,
    changeQty,
    totalCount,
    hint,
    canSave,
    isSaving,
    handleSave,
  };
};

import React, {useEffect, useMemo, useState} from 'react';
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  ShoppingBasket,
  LogIn,
  Loader2,
} from 'lucide-react';
import {Link, useNavigate} from '@tanstack/react-router';
import {useAuthContext} from '@/context/AuthContext';
import {useCart} from '@/context/CartContext';
import {useGetAllProducts} from '@/lib/api and mutation/product/useProductApi';
import {useGetAddress} from '@/lib/api and mutation/Order/useAdress';
import {useCreatePreorder} from '@/lib/api and mutation/Preorder/usePreorder';
import {mapApiProductToProduct} from '@/utils/productMapper';
import {PreorderItem, Product} from '@/types/OrderType';
import {QuantityStepper} from './QuantityStepper';
import {SearchBar} from './SearchBar';
import {AddressModal} from './AddressModal';
import {useTranslation} from 'react-i18next';
import {currentLocale} from '@/i18n';

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

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
    : date.toLocaleDateString(currentLocale(), {day: 'numeric', month: 'short'});
};

const qtyKey = (productId: string, weight: string) => `${productId}|${weight}`;

interface PreorderPageProps {
  onBack: () => void;
}

export const PreorderPage: React.FC<PreorderPageProps> = ({onBack}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {isAuthenticated} = useAuthContext();
  const {address, setAddress} = useCart();
  const {data: productsData, isLoading: productsLoading} = useGetAllProducts();
  const {data: getadress} = useGetAddress();
  const {mutate: savePreorder, isPending: isSaving} = useCreatePreorder();

  const todayIso = useMemo(() => toIsoDate(new Date()), []);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeights, setSelectedWeights] = useState<
    Record<string, string>
  >({});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Price is still recorded per line for the future API; it is never displayed.
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
      const copy = {...prev};
      if (next === 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });
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
      {onSuccess: () => navigate({to: '/orders'})},
    );
  };

  const header = (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/[0.04] bg-[#fcf9f8]/95 px-4 py-2.5 backdrop-blur-md">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 cursor-pointer rounded-full p-1 text-[#1b1c1c] transition-colors hover:bg-black/5"
        aria-label={t('common.back')}
      >
        <ArrowLeft size={22} strokeWidth={2.2} />
      </button>
      <div className="leading-tight">
        <h1 className="text-base font-bold tracking-tight text-[#1b1c1c]">
          {t('nav.preorder')}
        </h1>
        <p className="text-[11px] text-[#525e54]">{t('preorder.subtitle')}</p>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcf9f8]">
        {header}
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-[#e0e6e0] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9] text-[#1b5e20]">
              <LogIn size={30} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-extrabold text-[#1b1c1c]">
                {t('orders.loginTitle')}
              </h2>
              <p className="text-xs text-[#525e54]">
                {t('preorder.loginDesc')}
              </p>
            </div>
            <Link
              to="/signin"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00450d] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#1b5e20]"
            >
              <LogIn size={16} />
              <span>{t('orders.loginButton')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-[#cfd8d0] bg-white px-2 py-1.5 text-xs text-[#1b1c1c] outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]';

  return (
    <div className="min-h-screen bg-[#fcf9f8] pb-36">
      {header}

      <div className="space-y-3 px-4 pt-2.5">
        {/* Compact schedule + address card */}
        <div className="shadow-2xs rounded-2xl border border-[#e0e6e0] bg-white p-2.5">
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b5e20]">
                {t('preorder.date')}
              </span>
              <input
                type="date"
                min={todayIso}
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b5e20]">
                {t('preorder.time')}
              </span>
              <input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
          {scheduleChosen && !isFuture && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {t('preorder.hintFuture')}
            </p>
          )}

          <div className="my-2 border-t border-[#e0e6e0]" />

          {/* Address — same behaviour as Cart */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#1b5e20]">
                <MapPin size={12} />
                {t('cart.deliveryAddress')}
              </span>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="cursor-pointer text-xs font-bold text-[#00450d] hover:underline"
              >
                {t('cart.changeAdd')}
              </button>
            </div>

            {addressList.length > 1 && (
              <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto">
                {addressList.map((item: any, idx: number) => {
                  const isSelected =
                    (addressId || selectedAddress?.id) === item.id;
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
                      className={`shrink-0 cursor-pointer rounded-lg border px-1.5 py-0.5 text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'border-[#00450d] bg-[#00450d] text-white'
                          : 'border-gray-200 hover:border-gray-300 bg-[#f9fbf9] text-[#525e54]'
                      }`}
                    >
                      {t('address.addressN', {n: idx + 1})}
                    </button>
                  );
                })}
              </div>
            )}

            {selectedAddress ? (
              <div
                onClick={() => setShowAddressModal(true)}
                className="min-w-0 cursor-pointer text-xs leading-snug"
              >
                <p className="truncate font-bold text-[#1b1c1c]">
                  {selectedAddress.address}
                </p>
                <p className="truncate text-[11px] text-[#525e54]">
                  {[
                    selectedAddress.landmark,
                    selectedAddress.pincode,
                    selectedAddress.contactNo &&
                      t('cart.contact', {no: selectedAddress.contactNo}),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            ) : (
              <div
                onClick={() => setShowAddressModal(true)}
                className="border-gray-300 cursor-pointer rounded-xl border border-dashed py-1.5 text-center text-xs font-semibold text-[#00450d] hover:border-[#1b5e20]"
              >
                {t('cart.selectAddress')}
              </div>
            )}
          </div>
        </div>

        {/* Products — Home-style cards, no prices */}
        <div className="space-y-2">
          <h2 className="text-sm font-extrabold text-[#1b1c1c]">
            {t('preorder.whatNeed')}
          </h2>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {productsLoading ? (
          <div className="py-10 text-center text-[#1b5e20]">
            <Loader2 size={24} className="mx-auto animate-spin" />
            <p className="mt-2 text-xs font-semibold">
              {t('preorder.loading')}
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-10 text-center text-[#525e54]">
            <ShoppingBasket size={36} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">{t('categories.emptyTitle')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {filteredProducts.map((p) => {
              const currentWeight =
                selectedWeights[p.id] ||
                p.defaultWeight ||
                p.weightOptions[0]?.weight ||
                '';
              const count = quantities[qtyKey(p.id, currentWeight)] || 0;

              return (
                <div
                  key={p.id}
                  className="relative flex flex-col justify-between overflow-hidden rounded-md border border-[#e0e6e0] bg-white shadow-sm"
                >
                  <div className="relative flex aspect-square w-full items-center justify-center bg-[#f4f6f4]">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-2.5">
                    <div className="flex-1">
                      <h3 className="line-clamp-1 text-xs font-bold leading-snug text-[#1a1c1a] sm:text-sm">
                        {p.name}
                      </h3>

                      {/* Weight pills (no price) */}
                      <div className="mb-2 mt-2 flex gap-1 overflow-x-auto pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {p.weightOptions.map((w) => {
                          const isSel = w.weight === currentWeight;
                          const wCount =
                            quantities[qtyKey(p.id, w.weight)] || 0;
                          return (
                            <button
                              key={w.weight}
                              type="button"
                              onClick={() =>
                                setSelectedWeights((prev) => ({
                                  ...prev,
                                  [p.id]: w.weight,
                                }))
                              }
                              className={`relative shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-all ${
                                isSel
                                  ? 'shadow-2xs border-[#2e7d32] bg-[#e8f5e9] font-bold text-[#1b5e20]'
                                  : 'border-[#cfd8d0] bg-white text-[#525e54] hover:border-[#2e7d32]/60'
                              }`}
                            >
                              {w.weight}
                              {wCount > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#1b5e20] px-0.5 text-[9px] font-bold text-white">
                                  {wCount}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {count > 0 ? (
                        <QuantityStepper
                          quantity={count}
                          onIncrement={() => changeQty(p.id, currentWeight, 1)}
                          onDecrement={() => changeQty(p.id, currentWeight, -1)}
                          size="sm"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => changeQty(p.id, currentWeight, 1)}
                          className="shadow-2xs h-7 cursor-pointer rounded-lg border border-[#2e7d32] bg-white px-3 text-xs font-black uppercase tracking-wider text-[#2e7d32] transition-all hover:bg-[#e8f5e9] active:scale-95"
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
        )}
      </div>

      {/* Sticky save bar (above bottom navigation) — no amount shown */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-black/[0.08] bg-white px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0 leading-tight">
            <span className="block text-sm font-black text-[#00450d]">
              {t('orders.itemCount', {count: totalCount})}
            </span>
            <span className="block truncate text-[11px] text-[#525e54]">
              {hint}
            </span>
          </div>
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#00450d] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#1b5e20] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CalendarClock size={15} />
            )}
            {isSaving ? t('preorder.saving') : t('preorder.save')}
          </button>
        </div>
      </div>

      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} />
      )}
    </div>
  );
};

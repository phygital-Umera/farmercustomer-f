import React, { useMemo, useEffect } from 'react';
import { Sprout, ChevronDown, User, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useGetAddress } from '@/lib/api and mutation/Order/useAdress';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onOpenAddress?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddress, onOpenProfile }) => {
  const { address, setAddress } = useCart();
  const { t } = useTranslation();
  const { data: addressResponse } = useGetAddress();

  // Safely extract address list from API
  const addressList = useMemo(() => {
    if (!addressResponse) return [];
    const resData = (addressResponse as any)?.data;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(addressResponse)) return addressResponse;
    return [];
  }, [addressResponse]);

  // If no address selected in CartContext yet, auto-select first saved address from API
  useEffect(() => {
    if ((!address?.id || !address?.flat) && addressList.length > 0) {
      const first = addressList[0];
      setAddress({
        id: first.id,
        label: 'Saved Address',
        flat: first.address,
        landmark: first.landmark,
        pincode: first.pincode,
        city: (first as any).city || '',
        contactNo: first.contactNo,
      });
    }
  }, [addressList, address?.id, address?.flat, setAddress]);

  // Format the selected address label for display
  const displayAddress = useMemo(() => {
    // If flat/street address is available
    if (address?.flat) {
      const parts = [address.flat, address.landmark].filter(Boolean).join(', ');
      return address.pincode ? `${parts} (${address.pincode})` : parts;
    }

    // If landmark is available
    if (address?.landmark) {
      return address.pincode ? `${address.landmark} (${address.pincode})` : address.landmark;
    }

    // Fallback to first address in list if context hasn't updated yet
    if (addressList.length > 0) {
      const first = addressList[0];
      const parts = [first.address, first.landmark].filter(Boolean).join(', ');
      return first.pincode ? `${parts} (${first.pincode})` : parts;
    }

    if (address?.city && address?.pincode) {
      return `${address.city} ${address.pincode}`;
    }
    if (address?.pincode) {
      return t('header.pincode', { pincode: address.pincode });
    }

    return t('header.selectLocation');
  }, [address, addressList, t]);

  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-black/[0.04]">
      <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
        <div className="flex flex-col">
          {/* Brand Name */}
          <div className="flex items-center gap-1.5 text-[#00450d]">
            <Sprout size={20} className="stroke-[2.4] text-[#1b5e20]" />
            <span className="font-bold text-lg sm:text-xl tracking-tight leading-none text-[#00450d]">
              {t('header.brand')}
            </span>
          </div>

          {/* Delivery Location pill */}
          <button
            type="button"
            onClick={onOpenAddress}
            className="flex items-center gap-1 text-[12px] sm:text-[13px] text-[#41493e] hover:text-[#00450d] transition-colors mt-0.5 text-left cursor-pointer group"
            title={displayAddress}
          >
            <MapPin size={12} className="text-[#1b5e20] shrink-0" />
            <span className="font-medium truncate max-w-[210px] sm:max-w-xs">
              {t('header.deliverTo')} <span className="text-[#1b1c1c] font-semibold">{displayAddress}</span> {t('header.eta')}
            </span>
            <ChevronDown size={13} className="text-[#41493e] group-hover:translate-y-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* Profile Avatar Button */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-[#00450d] text-white flex items-center justify-center hover:bg-[#1b5e20] transition-colors shadow-sm shrink-0 cursor-pointer"
          aria-label={t('header.profile')}
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
};

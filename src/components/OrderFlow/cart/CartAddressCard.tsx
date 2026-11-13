import React from 'react';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SelectedAddressData } from './types';

interface CartAddressCardProps {
  addressList: any[];
  selectedAddress: SelectedAddressData | null;
  selectedAddressId: string;
  onSelectAddress: (addr: any, index: number) => void;
  onOpenAddressModal: () => void;
}

export const CartAddressCard: React.FC<CartAddressCardProps> = ({
  addressList,
  selectedAddress,
  selectedAddressId,
  onSelectAddress,
  onOpenAddressModal,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-2.5 border border-[#e0e6e0] hover:border-[#1b5e20] transition-colors shadow-2xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#1b5e20] uppercase tracking-wider flex items-center gap-1">
          <MapPin size={13} />
          {t('cart.deliveryAddress')}
        </span>
        <button
          type="button"
          onClick={onOpenAddressModal}
          className="text-xs font-bold text-[#00450d] hover:underline cursor-pointer"
        >
          {t('cart.changeAdd')}
        </button>
      </div>

      {/* Quick Select Tabs if user has multiple saved addresses */}
      {addressList.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {addressList.map((item: any, idx: number) => {
            const isSelected = (selectedAddressId || selectedAddress?.id) === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectAddress(item, idx)}
                className={`px-1 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-[#00450d] text-white border-[#00450d]'
                    : 'bg-[#f9fbf9] text-[#525e54] border-gray-200 hover:border-gray-300'
                }`}
              >
                {t('address.addressN', { n: idx + 1 })}
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
              {t('cart.contact', { no: selectedAddress.contactNo })}
            </p>
          )}
        </div>
      ) : (
        <div
          onClick={onOpenAddressModal}
          className="text-xs text-[#525e54] py-2 cursor-pointer text-center border border-dashed border-gray-300 rounded-xl hover:border-[#1b5e20] transition-colors"
        >
          <p className="font-semibold text-[#00450d]">{t('cart.selectAddress')}</p>
        </div>
      )}
    </div>
  );
};

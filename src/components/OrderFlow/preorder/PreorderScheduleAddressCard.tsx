import React from 'react';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TimePicker12h } from '@/components/Forms/Input/TimePicker12h';

interface PreorderScheduleAddressCardProps {
  deliveryDate: string;
  setDeliveryDate: (val: string) => void;
  deliveryTime: string;
  setDeliveryTime: (val: string) => void;
  todayIso: string;
  scheduleChosen: boolean;
  isFuture: boolean;
  addressList: any[];
  selectedAddress: any;
  addressId: string;
  onSelectAddress: (item: any, idx: number) => void;
  onOpenAddressModal: () => void;
}

const inputClass =
  'w-full rounded-lg border border-[#cfd8d0] bg-white px-2 py-1.5 text-xs text-[#1b1c1c] outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32]';

export const PreorderScheduleAddressCard: React.FC<PreorderScheduleAddressCardProps> = ({
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  todayIso,
  scheduleChosen,
  isFuture,
  addressList,
  selectedAddress,
  addressId,
  onSelectAddress,
  onOpenAddressModal,
}) => {
  const { t } = useTranslation();

  return (
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
        <div className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b5e20]">
            {t('preorder.time')}
          </span>
          <TimePicker12h
            value={deliveryTime}
            onChange={setDeliveryTime}
            className={inputClass}
          />
        </div>
      </div>

      {scheduleChosen && !isFuture && (
        <p className="mt-1 text-[11px] font-medium text-red-500">
          {t('preorder.hintFuture')}
        </p>
      )}

      <div className="my-2 border-t border-[#e0e6e0]" />

      {/* Address */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#1b5e20]">
            <MapPin size={12} />
            {t('cart.deliveryAddress')}
          </span>
          <button
            type="button"
            onClick={onOpenAddressModal}
            className="cursor-pointer text-xs font-bold text-[#00450d] hover:underline"
          >
            {t('cart.changeAdd')}
          </button>
        </div>

        {addressList.length > 1 && (
          <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto">
            {addressList.map((item: any, idx: number) => {
              const isSelected = (addressId || selectedAddress?.id) === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectAddress(item, idx)}
                  className={`shrink-0 cursor-pointer rounded-lg border px-1.5 py-0.5 text-[11px] font-bold transition-all ${
                    isSelected
                      ? 'border-[#00450d] bg-[#00450d] text-white'
                      : 'border-gray-200 hover:border-gray-300 bg-[#f9fbf9] text-[#525e54]'
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
                  t('cart.contact', { no: selectedAddress.contactNo }),
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        ) : (
          <div
            onClick={onOpenAddressModal}
            className="border-gray-300 cursor-pointer rounded-xl border border-dashed py-1.5 text-center text-xs font-semibold text-[#00450d] hover:border-[#1b5e20]"
          >
            {t('cart.selectAddress')}
          </div>
        )}
      </div>
    </div>
  );
};

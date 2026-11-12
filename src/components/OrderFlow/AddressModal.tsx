import React, { useState, useEffect } from 'react';
import { X, MapPin, Plus, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateAdresss,
  useGetAddress,
  useUpdateAddress,
} from '@/lib/api and mutation/Order/useAdress';
import { useAuthContext } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

interface AddressModalProps {
  onClose: () => void;
}

const adressSchema = z.object({
  address: z.string().min(2, 'validation.addressRequired'),
  landmark: z.string().min(2, 'validation.landmarkRequired'),
  pincode: z.string().min(4, 'validation.pincodeRequired'),
  contactNo: z
    .string()
    .min(10, 'validation.contactMin')
    .regex(/^[0-9+\-\s]+$/, 'validation.contactInvalid'),
});

export type FormType = z.infer<typeof adressSchema>;

export interface SavedAddressItem {
  id: string;
  address: string;
  landmark: string;
  pincode: string;
  contactNo: string;
  customerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const AddressModal: React.FC<AddressModalProps> = ({ onClose }) => {
  const { address, setAddress } = useCart();
  const { user } = useAuthContext();

  const { data: adressResponse, isLoading: isLoadingAddresses } = useGetAddress();
  const { t } = useTranslation();
  const { mutate: createAddressMutation, isPending: isCreating } = useCreateAdresss();
  const { mutate: updateAddressMutation, isPending: isUpdating } = useUpdateAddress();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Safely extract address list from API response
  const addressList: SavedAddressItem[] = React.useMemo(() => {
    if (!adressResponse) return [];
    const resData = (adressResponse as any)?.data;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData)) return resData;
    return [];
  }, [adressResponse]);

  const methods = useForm<FormType>({
    resolver: zodResolver(adressSchema),
    defaultValues: {
      address: '',
      landmark: '',
      pincode: '',
      contactNo: user?.phoneNumber || '',
    },
  });

  const handleSelectAddress = (item: SavedAddressItem) => {
    setSelectedAddressId(item.id);
    methods.reset({
      address: item.address || '',
      landmark: item.landmark || '',
      pincode: item.pincode || '',
      contactNo: item.contactNo || user?.phoneNumber || '',
    });
    setAddress({
      id: item.id,
      label: 'Saved Address',
      flat: item.address,
      landmark: item.landmark,
      pincode: item.pincode,
      city: (item as any).city || address.city || '',
      contactNo: item.contactNo,
    });
  };

  const handleAddNew = () => {
    setSelectedAddressId(null);
    methods.reset({
      address: '',
      landmark: '',
      pincode: '',
      contactNo: user?.phoneNumber || '',
    });
  };

  // Auto-select first address if available and none selected yet
  useEffect(() => {
    if (addressList.length > 0 && selectedAddressId === null) {
      const match = addressList.find((a) => a.id === address.id) || addressList[0];
      handleSelectAddress(match);
    }
  }, [addressList]);

  const onSubmit = (data: FormType) => {
    if (selectedAddressId) {
      // Update existing address via PUT with ID param
      updateAddressMutation(
        { id: selectedAddressId, data },
        {
          onSuccess: () => {
            setAddress({
              id: selectedAddressId,
              label: 'Saved Address',
              flat: data.address,
              landmark: data.landmark,
              pincode: data.pincode,
              city: address.city || 'Mumbai',
              contactNo: data.contactNo,
            });
            onClose();
          },
        }
      );
    } else {
      // Create new address via POST
      createAddressMutation(data, {
        onSuccess: (res: any) => {
          const newId = res?.data?.id || res?.data?.data?.id || res?.id;
          setAddress({
            id: newId,
            label: 'New Address',
            flat: data.address,
            landmark: data.landmark,
            pincode: data.pincode,
            city: address.city || 'Mumbai',
            contactNo: data.contactNo,
          });
          onClose();
        },
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 space-y-4 shadow-xl animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00450d]">
            <MapPin size={20} />
            <h3 className="font-extrabold text-base sm:text-lg">{t('address.title')}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Address Tabs Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#525e54]">{t('address.yourAddresses')}</p>
            {isLoadingAddresses && (
              <span className="text-[10px] text-[#1b5e20] flex items-center gap-1 font-semibold">
                <Loader2 size={10} className="animate-spin" /> {t('common.loading')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {addressList.map((item, index) => {
              const isSelected = selectedAddressId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectAddress(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#00450d] text-white border-[#00450d] shadow-xs'
                      : 'bg-[#f9fbf9] text-[#1b1c1c] border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin size={12} className={isSelected ? 'text-white' : 'text-[#1b5e20]'} />
                  <span>{t('address.addressN', { n: index + 1 })}</span>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </button>
              );
            })}

            {/* Add New Tab Button */}
            <button
              type="button"
              onClick={handleAddNew}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 border ${
                selectedAddressId === null
                  ? 'bg-[#00450d] text-white border-[#00450d] shadow-xs'
                  : 'bg-[#e8f5e9] text-[#00450d] border-dashed border-[#1b5e20]/40 hover:bg-[#c8e6c9]'
              }`}
            >
              <Plus size={14} />
              <span>{t('address.addNew')}</span>
            </button>
          </div>

          {/* Active selection info pill */}
          {/* {selectedAddressId && (
            <p className="text-[11px] text-[#525e54] bg-[#f9fbf9] px-2.5 py-1.5 rounded-lg border border-gray-100 truncate">
              Editing: <strong className="text-[#1b1c1c]">{methods.watch('address') || 'Address'}</strong>
            </p>
          )} */}
        </div>

        {/* Address Form wrapped with FormProvider */}
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-3 pt-2 border-t border-gray-100"
          >
            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-xs font-bold text-[#1b1c1c] mb-1">
                {t('address.addressLabel')}
              </label>
              <input
                id="address"
                type="text"
                {...methods.register('address')}
                className={`w-full bg-[#f9fbf9] border rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] transition-colors ${
                  methods.formState.errors.address
                    ? 'border-red-500 bg-red-50/20'
                    : 'border-gray-200'
                }`}
                placeholder={t('address.addressPlaceholder')}
              />
              {methods.formState.errors.address && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">
                  {t(methods.formState.errors.address.message || '')}
                </p>
              )}
            </div>

            {/* Landmark Field */}
            <div>
              <label htmlFor="landmark" className="block text-xs font-bold text-[#1b1c1c] mb-1">
                {t('address.landmark')}
              </label>
              <input
                id="landmark"
                type="text"
                {...methods.register('landmark')}
                className={`w-full bg-[#f9fbf9] border rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] transition-colors ${
                  methods.formState.errors.landmark
                    ? 'border-red-500 bg-red-50/20'
                    : 'border-gray-200'
                }`}
                placeholder={t('address.landmarkPlaceholder')}
              />
              {methods.formState.errors.landmark && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">
                  {t(methods.formState.errors.landmark.message || '')}
                </p>
              )}
            </div>

            {/* Pincode & Contact Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label htmlFor="pincode" className="block text-xs font-bold text-[#1b1c1c] mb-1">
                  {t('address.pincode')}
                </label>
                <input
                  id="pincode"
                  type="text"
                  maxLength={6}
                  {...methods.register('pincode')}
                  className={`w-full bg-[#f9fbf9] border rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] transition-colors ${
                    methods.formState.errors.pincode
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-gray-200'
                  }`}
                  placeholder={t('address.pincodePlaceholder')}
                />
                {methods.formState.errors.pincode && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">
                    {t(methods.formState.errors.pincode.message || '')}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contactNo" className="block text-xs font-bold text-[#1b1c1c] mb-1">
                  {t('address.contactNo')}
                </label>
                <input
                  id="contactNo"
                  type="tel"
                  maxLength={10}
                  {...methods.register('contactNo')}
                  className={`w-full bg-[#f9fbf9] border rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] transition-colors ${
                    methods.formState.errors.contactNo
                      ? 'border-red-500 bg-red-50/20'
                      : 'border-gray-200'
                  }`}
                  placeholder={t('address.contactPlaceholder')}
                />
                {methods.formState.errors.contactNo && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">
                    {t(methods.formState.errors.contactNo.message || '')}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00450d] hover:bg-[#1b5e20] active:scale-[0.99] text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                <span>
                  {selectedAddressId ? t('address.update') : t('address.save')}
                </span>
              </button>

              {/* Quick Deliver Here Button when an existing address is selected */}
              {selectedAddressId && (
                <button
                  type="button"
                  onClick={() => {
                    const currentValues = methods.getValues();
                    setAddress({
                      id: selectedAddressId,
                      label: 'Saved Address',
                      flat: currentValues.address,
                      landmark: currentValues.landmark,
                      pincode: currentValues.pincode,
                      city: address.city || 'Mumbai',
                      contactNo: currentValues.contactNo,
                    });
                    onClose();
                  }}
                  className="w-full bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#00450d] font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {t('address.useWithoutUpdate')}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

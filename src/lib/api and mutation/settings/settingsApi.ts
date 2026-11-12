import {api} from '@/utils/axios';

// Public endpoints — work for guests too.
export const getBanners = async () => {
  const res = await api.get('customer/settings/banners');
  return res.data;
};

export const getPaymentDetails = async () => {
  const res = await api.get('customer/settings/payment-details');
  return res.data;
};

export const getContactNumbers = async () => {
  const res = await api.get('customer/settings/contact-numbers');
  return res.data;
};

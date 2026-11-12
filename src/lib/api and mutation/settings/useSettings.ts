import {useQuery} from '@tanstack/react-query';
import {getBanners, getContactNumbers, getPaymentDetails} from './settingsApi';

export interface PaymentDetails {
  upiId: string;
  paymentNumber: string;
}

/** `{upiId, paymentNumber}` (possibly wrapped in the API envelope) or null when not set up. */
const normalizePaymentDetails = (res: any): PaymentDetails | null => {
  const payload =
    res && typeof res === 'object' && ('data' in res || 'statusCode' in res)
      ? res.data
      : res;
  const upiId = String(payload?.upiId ?? '').trim();
  if (!upiId) return null;
  return {upiId, paymentNumber: String(payload?.paymentNumber ?? '').trim()};
};

export const useGetPaymentDetails = (enabled = true) =>
  useQuery({
    queryKey: ['payment-details'],
    queryFn: getPaymentDetails,
    select: normalizePaymentDetails,
    staleTime: 5 * 60 * 1000,
    enabled,
  });

export interface Banner {
  id: string;
  image: string;
  title?: string;
  link?: string;
}

export interface ContactNumber {
  label?: string;
  number: string;
}

const pickArray = (res: any, key: string): any[] => {
  const candidates = [
    res?.data?.[key],
    res?.[key],
    res?.data?.data,
    res?.data,
    res,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
};

const normalizeBanners = (res: any): Banner[] =>
  pickArray(res, 'banners')
    .filter((b) => b && b.isActive !== false)
    // A banner may carry several images (`images: string[]`) — each becomes a slide
    .flatMap((b, i) => {
      const images: string[] =
        typeof b === 'string'
          ? [b]
          : Array.isArray(b.images) && b.images.length
            ? b.images
            : [b.imageUrl || b.image || b.url || b.bannerImage || ''];
      return images
        .map((img: any) => (typeof img === 'string' ? img : img?.url || ''))
        .filter(Boolean)
        .map((image: string, j: number) => ({
          id: `${b?._id || b?.id || i}-${j}`,
          image,
          title: b?.title || b?.name,
          link: b?.link || b?.redirectUrl || b?.videoLink || undefined,
        }));
    });

const toContact = (c: any, label?: string): ContactNumber | null => {
  if (c === null || c === undefined || c === '') return null;
  if (typeof c === 'string' || typeof c === 'number') {
    return {label, number: String(c)};
  }
  const number = c.phone || c.number || c.contactNo || c.mobile || c.value;
  if (!number) return null;
  return {label: c.label || c.name || c.type || label, number: String(number)};
};

const LABEL_KEYS = ['primary', 'secondary', 'whatsapp', 'support', 'helpline'];

const normalizeContacts = (res: any): ContactNumber[] => {
  const arr = pickArray(res, 'contactNumbers');
  if (arr.length) {
    return arr.map((c) => toContact(c)).filter(Boolean) as ContactNumber[];
  }
  // Object shape, e.g. {primary: '...', secondary: '...'}
  const obj =
    res?.data?.contactNumbers || res?.contactNumbers || res?.data || res;
  if (obj && typeof obj === 'object') {
    return Object.entries(obj)
      .filter(
        ([k, v]) =>
          (typeof v === 'string' || typeof v === 'number') &&
          (LABEL_KEYS.includes(k.toLowerCase()) ||
            /^\+?[\d\s-]{6,}$/.test(String(v))),
      )
      .map(([k, v]) => toContact(v, k.charAt(0).toUpperCase() + k.slice(1)))
      .filter(Boolean) as ContactNumber[];
  }
  return [];
};

export const useGetBanners = () =>
  useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
    select: normalizeBanners,
    staleTime: 5 * 60 * 1000,
  });

export const useGetContactNumbers = () =>
  useQuery({
    queryKey: ['contact-numbers'],
    queryFn: getContactNumbers,
    select: normalizeContacts,
    staleTime: 5 * 60 * 1000,
  });

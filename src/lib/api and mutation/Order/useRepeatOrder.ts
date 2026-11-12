import { useNavigate } from '@tanstack/react-router';
import i18n from '@/i18n'
import toast from 'react-hot-toast';
import { ApiOrder, CartItemApiPayload } from '@/types/OrderType';
import { useAddToCart } from '../cart/useCart';

/**
 * Re-adds every item of a past order to the backend cart, then opens the Cart page.
 */
export const useRepeatOrder = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useAddToCart();

  const repeatOrder = (order: ApiOrder) => {
    const items: CartItemApiPayload[] = (order.items || [])
      .filter((i) => i.productId)
      .map((i) => ({
        productId: i.productId,
        price: Number(i.price),
        productQuantity: Number(i.productQuantity),
        productCount: Number(i.productCount) || 1,
      }));

    if (items.length === 0) {
      toast.error(i18n.t('toast.repeatEmpty'));
      return;
    }

    mutate({ items }, { onSuccess: () => navigate({ to: '/cart' }) });
  };

  return { repeatOrder, isRepeating: isPending };
};

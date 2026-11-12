import {api} from '@/utils/axios';
import {CreatePreorderInput} from '@/types/OrderType';

// Pre-orders are stored as orders (orderType: 'PREORDER') and are
// returned by GET /customer/orders, so only the create call lives here.
export const createPreorder = async (data: CreatePreorderInput) => {
  const res = await api.post('customer/orders/pre-order', data);
  return res.data;
};

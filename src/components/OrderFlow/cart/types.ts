import { PaymentMethod } from '@/types/OrderType';

export interface DisplayCartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  weightLabel: string;
  productQuantity: number;
  price: number;
  count: number;
}

export interface SelectedAddressData {
  id?: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  contactNo?: string;
  [key: string]: any;
}

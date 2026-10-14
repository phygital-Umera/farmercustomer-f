export enum unit {
  KG = 'KG',
  GRAM = 'GRAM',
  LTR = 'LTR',
  ML = 'ML',
  PCS = 'PCS',
  PACKET = 'PACKET',
}

export const Unit = unit;
export type Unit = unit | `${unit}`;

export interface WeightOption {
  weight: string; // e.g. "250 g", "500 g", "1 kg", "2 kg"
  price: number;
  mrp: number;
  note?: string; // e.g. "Chhota Parivar (1 Din)", "Sabse Popular Choice"
  isPopular?: boolean;
}

export interface TadkaItem {
  id: string;
  name: string;
  hindiName?: string;
  weight: string;
  price: number;
  mrp: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  englishSubtitle: string;
  category: 'all' | 'daily' | 'leafy' | 'roots' | 'exotic' | string;
  categoryLabel: string;
  unit?: unit | string;
  image: string;
  originBadge: string; // e.g. "Direct from Nashik Mandi"
  freshnessBadge: string; // e.g. "AAJ SUBAH 4 AM MANDI FRESH"
  certifiedBadge: string; // e.g. "100% Certified Wazan"
  discountPercent: number; // e.g. 22
  defaultWeight: string; // e.g. "1 kg"
  price: number;
  mrp: number;
  weightOptions: WeightOption[];
  localMandiPrice: number; // e.g. 40 (for Mandi Bhav Muqabla)
  apnaMandiPrice: number; // e.g. 35
  guarantees: string[];
  rasoiTips: {
    description: string;
    tags: string[];
  };
  quickAddTadka: TadkaItem[];
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  unitPrice: number;
  unitMrp: number;
  quantity: number;
}

export type DeliveryInstruction = 'ring_bell' | 'leave_door' | 'do_not_ring';

export type PaymentMethod = 'cod' | 'upi' | 'card';

export type ActiveTab = 'home' | 'categories' | 'offers' | 'cart' | 'orders';

export type ViewState = 
  | { type: 'home' }
  | { type: 'cart' }
  | { type: 'orders' }
  | { type: 'order_detail'; orderId: string }
  | { type: 'product_detail'; productId: string };

export interface OrderItem {
  name: string;
  image: string;
  weight: string;
  quantity: number;
  price: number;
  mrp: number;
}

export interface Order {
  id: string;
  status: 'live' | 'delivered';
  placedAt: string;
  items: OrderItem[];
  itemsTotal: number;
  discountTotal: number;
  deliveryCharge: number;
  totalPaid: number;
  savingsTotal: number;
  paymentMethod: PaymentMethod;
  deliveryInstruction?: string;
  riderName?: string;
  riderPhone?: string;
  deliveryAddress: {
    label: string;
    flat: string;
    landmark: string;
    pincode: string;
    city: string;
  };
}
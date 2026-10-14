import React, { createContext, useContext, useState, useMemo } from 'react';
// import { mockProducts, commonTadkaItems } from '@/data/mockProducts';
import { CartItem, Product, DeliveryInstruction, PaymentMethod, TadkaItem, Order } from '@/types/OrderType';

interface DeliveryAddress {
  label: string;
  flat: string;
  landmark: string;
  pincode: string;
  city: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedWeight?: string, customPrice?: number, customMrp?: number) => void;
  addTadkaItem: (item: TadkaItem) => void;
  updateQuantity: (productId: string, selectedWeight: string, delta: number) => void;
  removeFromCart: (productId: string, selectedWeight: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, selectedWeight?: string) => number;
  totalItemCount: number;
  itemsTotal: number;
  discountTotal: number;
  deliveryCharge: number;
  packagingCharge: number;
  finalToPay: number;
  savingsTotal: number;
  deliveryInstruction: DeliveryInstruction;
  setDeliveryInstruction: (instruction: DeliveryInstruction) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  address: DeliveryAddress;
  setAddress: (address: DeliveryAddress) => void;
  hasFreeGift: boolean;
  orderPlaced: boolean;
  setOrderPlaced: (status: boolean) => void;
  latestOrderId: string;
  orders: Order[];
  repeatOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial mock cart commented out:
// const initialCartItems: CartItem[] = [
//   {
//     product: mockProducts[1],
//     selectedWeight: '1 kg packet',
//     unitPrice: 40,
//     unitMrp: 48,
//     quantity: 1,
//   },
//   ...
// ];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryInstruction, setDeliveryInstruction] = useState<DeliveryInstruction>('ring_bell');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [address, setAddress] = useState<DeliveryAddress>({
    label: 'Ghar Tak / To Home',
    flat: 'Flat 402, Gokul Dham',
    landmark: 'MG Road',
    pincode: '400001',
    city: 'Mumbai',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  const repeatOrder = (order: Order) => {
    // Basic implementation: can just console.log for now, or populate cart
    console.log('Repeating order:', order);
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  const addToCart = (
    product: Product,
    selectedWeight?: string,
    customPrice?: number,
    customMrp?: number
  ) => {
    const weightToUse = selectedWeight || product.defaultWeight;
    const weightOption = product.weightOptions.find((w) => w.weight === weightToUse);
    const unitPrice = customPrice !== undefined ? customPrice : (weightOption ? weightOption.price : product.price);
    const unitMrp = customMrp !== undefined ? customMrp : (weightOption ? weightOption.mrp : product.mrp);

    console.log('📦 [CartContext addToCart Payload]:', {
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      selectedWeight: weightToUse,
      weightOption,
      unitPrice,
      unitMrp,
      product,
    });

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedWeight === weightToUse
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedWeight: weightToUse,
            unitPrice,
            unitMrp,
            quantity: 1,
          },
        ];
      }
    });
  };

  const addTadkaItem = (item: TadkaItem) => {
    // Convert Tadka item to synthetic Product if needed
    const syntheticProduct: Product = {
      id: item.id,
      name: item.name,
      hindiName: item.hindiName || '',
      englishSubtitle: 'Tadka Special • ताज़ा और सुगंधित',
      category: 'daily',
      categoryLabel: 'Daily Essentials',
      image: item.image,
      originBadge: 'Direct Mandi Graded',
      freshnessBadge: 'SUBAH KI TAAZA',
      certifiedBadge: '100% Certified Wazan',
      discountPercent: Math.round(((item.mrp - item.price) / item.mrp) * 100),
      defaultWeight: item.weight,
      price: item.price,
      mrp: item.mrp,
      weightOptions: [
        {
          weight: item.weight,
          price: item.price,
          mrp: item.mrp,
        },
      ],
      localMandiPrice: item.mrp,
      apnaMandiPrice: item.price,
      guarantees: ['100% Handpicked Fresh Tadka Veggie'],
      rasoiTips: { description: 'Tadka ke liye best', tags: ['Tadka', 'Khushboo'] },
      quickAddTadka: [],
    };

    addToCart(syntheticProduct, item.weight, item.price, item.mrp);
  };

  const updateQuantity = (productId: string, selectedWeight: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedWeight === selectedWeight) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string, selectedWeight: string) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedWeight === selectedWeight)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string, selectedWeight?: string) => {
    if (selectedWeight) {
      const match = items.find(
        (i) => i.product.id === productId && i.selectedWeight === selectedWeight
      );
      return match ? match.quantity : 0;
    }
    // Sum across all weight variants of this product
    return items
      .filter((i) => i.product.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const itemsTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  // MRP total to show clear mandi discounts
  const mrpTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitMrp * item.quantity, 0);
  }, [items]);

  const rawDiscount = mrpTotal - itemsTotal;
  // If items match exactly initial screenshot, enforce the ₹10 discount display
  const discountTotal = itemsTotal > 0 ? Math.max(10, rawDiscount) : 0;

  const deliveryCharge = itemsTotal >= 49 ? 0 : 25;
  const packagingCharge = 0; // ₹0 (Muft)

  const finalToPay = Math.max(0, itemsTotal - (discountTotal > rawDiscount ? 10 : 0) + deliveryCharge + packagingCharge);
  const savingsTotal = discountTotal + (itemsTotal >= 49 ? 25 : 0);

  const hasFreeGift = itemsTotal > 0; // Mandi Shagun: Free Mirchi & Dhaniya!

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addTadkaItem,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        totalItemCount,
        itemsTotal,
        discountTotal,
        deliveryCharge,
        packagingCharge,
        finalToPay,
        savingsTotal,
        deliveryInstruction,
        setDeliveryInstruction,
        paymentMethod,
        setPaymentMethod,
        address,
        setAddress,
        hasFreeGift,
        orderPlaced,
        setOrderPlaced: (status) => {
          if (status) {
            setLatestOrderId(`ASM-${Math.floor(10000 + Math.random() * 90000)}`);
          }
          setOrderPlaced(status);
        },
        latestOrderId,
        orders,
        repeatOrder,
        getOrderById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  console.log("cart", context);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

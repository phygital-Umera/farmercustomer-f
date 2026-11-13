import React, { useState, useMemo } from 'react';
import { Bell, DoorOpen, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { currentLocale } from '@/i18n';
import { useCart } from '@/context/CartContext';
import { Order, ApiOrder } from '@/types/OrderType';
import { useGetOrder } from '@/lib/api and mutation/Order/useOrder';
import { generateOrderInvoice } from '@/utils/generateInvoice';
import { useRepeatOrder } from '@/lib/api and mutation/Order/useRepeatOrder';
import { useGetContactNumbers } from '@/lib/api and mutation/settings/useSettings';

export const useOrderDetailsData = (orderId: string) => {
  const { getOrderById } = useCart();
  const { t } = useTranslation();
  const { data: apiOrderData } = useGetOrder();
  const { repeatOrder, isRepeating } = useRepeatOrder();
  const { data: contactNumbers = [] } = useGetContactNumbers();

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showHelpAlert, setShowHelpAlert] = useState(false);

  // Raw API order (keeps productIds needed to repeat the order)
  const apiOrder: ApiOrder | undefined = useMemo(() => {
    if (!apiOrderData) return undefined;
    const raw = apiOrderData as any;
    const list: ApiOrder[] = Array.isArray(raw?.data?.orders)
      ? raw.data.orders
      : Array.isArray(raw?.orders)
      ? raw.orders
      : Array.isArray(raw?.data)
      ? raw.data
      : [];
    return list.find((o) => o.id === orderId || o.orderNo === orderId);
  }, [apiOrderData, orderId]);

  const localOrder = getOrderById(orderId);

  const order: Order | undefined = useMemo(() => {
    if (localOrder) return localOrder;
    const found = apiOrder;
    if (!found) return undefined;

    const formattedDate = (() => {
      try {
        return new Date(found.createdAt).toLocaleDateString(currentLocale(), {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      } catch {
        return found.createdAt;
      }
    })();

    const isDelivered =
      found.status?.toUpperCase() === 'DELIVERED' ||
      found.status?.toUpperCase() === 'COMPLETED';

    return {
      id: `#${(found.orderNo || found.id).slice(0, 8).toUpperCase()}`,
      status: isDelivered ? 'delivered' : 'live',
      placedAt: formattedDate,
      note: found.note,
      items: found.items.map((i) => ({
        name: i.productName.charAt(0).toUpperCase() + i.productName.slice(1),
        image: i.image || '',
        weight: i.totalQuantity ? `${i.totalQuantity} kg` : `${i.productQuantity} kg`,
        quantity: i.productCount || 1,
        price: Number(i.totalPrice ?? i.subtotal),
        mrp: Number(i.totalPrice ?? i.subtotal),
      })),
      itemsTotal: Number(found.subtotal),
      discountTotal: 0,
      deliveryCharge: 0,
      totalPaid: Number(found.grandTotal),
      savingsTotal: 0,
      paymentMethod: 'cod',
      deliveryInstruction: 'ring_bell',
      riderName: found.deliveryBoy?.name,
      riderPhone: found.deliveryBoy?.phone,
      deliveryAddress: {
        label: t('orderDetails.home'),
        flat: found.admin?.user?.fullname
          ? t('orderDetails.store', { name: found.admin.user.fullname })
          : t('orderDetails.online'),
        landmark: t('orderDetails.scaleVerified'),
        pincode: '',
        city: '',
      },
    };
  }, [localOrder, apiOrder, t]);

  const isLive = order?.status !== 'delivered';

  const handleDownloadInvoice = () => {
    if (!order) return;
    try {
      generateOrderInvoice(order);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to generate invoice:', err);
    }
  };

  const instructionInfo = useMemo(() => {
    switch (order?.deliveryInstruction) {
      case 'ring_bell':
        return { label: t('orderDetails.ringBell'), icon: <Bell size={14} className="text-amber-500" /> };
      case 'leave_door':
        return { label: t('orderDetails.leaveDoor'), icon: <DoorOpen size={14} className="text-amber-800" /> };
      case 'do_not_ring':
        return { label: t('orderDetails.doNotRing'), icon: <VolumeX size={14} className="text-amber-600" /> };
      default:
        return { label: t('orderDetails.standard'), icon: <Bell size={14} /> };
    }
  }, [order?.deliveryInstruction, t]);

  const handleRepeatOrder = () => {
    if (apiOrder) {
      repeatOrder(apiOrder);
    }
  };

  return {
    order,
    apiOrder,
    isLive,
    contactNumbers,
    downloadSuccess,
    showHelpAlert,
    setShowHelpAlert,
    isRepeating,
    handleDownloadInvoice,
    handleRepeatOrder,
    instructionInfo,
  };
};

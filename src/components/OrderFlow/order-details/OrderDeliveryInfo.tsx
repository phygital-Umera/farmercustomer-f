import React from 'react';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Order } from '@/types/OrderType';

interface OrderDeliveryInfoProps {
  order: Order;
  instructionInfo: {
    label: string;
    icon: React.ReactNode;
  };
}

export const OrderDeliveryInfo: React.FC<OrderDeliveryInfoProps> = ({
  order,
  instructionInfo,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-3">
      <div className="flex items-start gap-2.5">
        <MapPin size={18} className="text-[#1b5e20] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-[#1b1c1c]">{order.deliveryAddress.label}</p>
          <p className="text-[#1b1c1c] font-semibold mt-0.5">{order.deliveryAddress.flat}</p>
          <p className="text-[#525e54] text-[11px]">
            {order.deliveryAddress.landmark}, {order.deliveryAddress.city} {order.deliveryAddress.pincode}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[#e0e6e0]/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#525e54]">
          {instructionInfo.icon}
          <span className="font-medium">{instructionInfo.label}</span>
        </div>
        <span className="font-bold text-[#1b5e20] bg-[#e8f5e9] px-2 py-0.5 rounded">
          {t('orderDetails.verified')}
        </span>
      </div>
    </div>
  );
};

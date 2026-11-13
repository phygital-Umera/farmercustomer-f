import React from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Order } from '@/types/OrderType';

interface OrderStatusTrackerProps {
  order: Order;
  isLive: boolean;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  order,
  isLive,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e0e6e0] shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-black text-[#525e54] tracking-wider">
            {t('orderDetails.currentStatus')}
          </span>
          <h2 className="text-base font-extrabold text-[#1b1c1c] mt-0.5">
            {isLive ? t('orderDetails.riderOnWay') : t('orderDetails.delivered')}
          </h2>
        </div>
        {isLive ? (
          <span className="w-8 h-8 rounded-full bg-[#a0f399] text-[#00450d] flex items-center justify-center animate-pulse">
            <Zap size={18} fill="#00450d" />
          </span>
        ) : (
          <span className="w-8 h-8 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center">
            <CheckCircle2 size={20} />
          </span>
        )}
      </div>

      {/* Stepper Timeline */}
      <div className="pt-2 border-t border-[#e0e6e0]/60 space-y-2.5">
        <div className="flex items-center gap-3 text-xs">
          <div className="w-5 h-5 rounded-full bg-[#00450d] text-white flex items-center justify-center text-[10px] font-bold">
            ✓
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1b1c1c]">{t('orderDetails.stepPlaced')}</p>
            <p className="text-[10px] text-[#717a6d]">{order.placedAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="w-5 h-5 rounded-full bg-[#00450d] text-white flex items-center justify-center text-[10px] font-bold">
            ✓
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1b1c1c]">{t('orderDetails.stepWeighing')}</p>
            <p className="text-[10px] text-[#717a6d]">{t('orderDetails.stepWeighingDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isLive ? 'bg-[#a0f399] text-[#00450d] animate-bounce' : 'bg-[#00450d] text-white'
            }`}
          >
            {isLive ? '🛵' : '✓'}
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1b1c1c]">{t('orderDetails.stepOut')}</p>
            <p className="text-[10px] text-[#717a6d]">
              {t('orderDetails.rider', { name: order.riderName || 'Santosh Kumar' })} {order.riderPhone && `(${order.riderPhone})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isLive ? 'bg-gray-200 text-gray-500' : 'bg-[#00450d] text-white'
            }`}
          >
            {isLive ? '4' : '✓'}
          </div>
          <div className="flex-1">
            <p className={`font-bold ${isLive ? 'text-gray-400' : 'text-[#1b1c1c]'}`}>
              {t('orderDetails.stepDoorstep')}
            </p>
            <p className="text-[10px] text-[#717a6d]">
              {isLive ? t('orderDetails.window') : t('orderDetails.onTime')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, MapPin, Scale, Sparkles, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';

interface OrderSuccessModalProps {
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ onClose }) => {
  const { latestOrderId, finalToPay, address, items, clearCart } = useCart();
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(12 * 60); // 12 mins countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleDone = () => {
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-[#e8f5e9] text-[#1b5e20] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle size={36} className="text-[#1b5e20]" />
        </div>

        <div>
          <span className="bg-[#a0f399] text-[#00450d] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {t('orderSuccess.confirmed')}
          </span>
          <h2 className="text-xl font-black text-[#1b1c1c] mt-1.5">
            {t('orderSuccess.title')}
          </h2>
          <p className="text-xs text-[#525e54] mt-0.5">
            {t('orderSuccess.orderId')} <span className="font-bold text-[#1b1c1c]">{latestOrderId}</span>
          </p>
        </div>

        {/* Live Delivery Countdown */}
        <div className="bg-[#00450d] text-white rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#a0f399] font-bold">
            <Clock size={14} />
            <span>{t('orderSuccess.eta')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            {minutes}m {seconds < 10 ? `0${seconds}` : seconds}s
          </div>
          <p className="text-[11px] text-emerald-200 mt-1">
            {t('orderSuccess.rider', { name: 'Ramesh' })}
          </p>
        </div>

        {/* Verified details */}
        <div className="bg-[#f9fbf9] border border-[#e0e6e0] rounded-2xl p-3 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[#1b5e20] font-bold">
            <Scale size={14} />
            <span>{t('orderSuccess.certified')}</span>
          </div>
          <div className="flex items-start gap-2 text-[#525e54]">
            <MapPin size={14} className="shrink-0 mt-0.5 text-[#1b1c1c]" />
            <div>
              <p className="font-bold text-[#1b1c1c]">{address.flat}</p>
              <p className="text-[11px]">{address.landmark}, {address.city}</p>
            </div>
          </div>
          <div className="pt-1.5 border-t border-[#e0e6e0] flex justify-between font-bold text-[#1b1c1c]">
            <span>{t('orderSuccess.totalPayable')}</span>
            <span className="text-[#00450d] font-black">₹{finalToPay} ({t('common.cod')})</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDone}
          className="w-full bg-[#00450d] hover:bg-[#1b5e20] text-white font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer"
        >
          {t('orderSuccess.done')}
        </button>
      </div>
    </div>
  );
};

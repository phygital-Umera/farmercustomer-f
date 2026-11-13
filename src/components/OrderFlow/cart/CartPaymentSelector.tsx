import React from 'react';
import { Banknote, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PaymentMethod } from '@/types/OrderType';

interface CartPaymentSelectorProps {
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onOpenUpiModal: () => void;
}

export const CartPaymentSelector: React.FC<CartPaymentSelectorProps> = ({
  paymentMethod,
  onSelectPaymentMethod,
  onOpenUpiModal,
}) => {
  const { t } = useTranslation();

  const paymentOptions: {
    id: PaymentMethod;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'cod',
      title: t('cart.codTitle'),
      description: t('cart.codDesc'),
      icon: <Banknote size={20} className="text-[#1b5e20]" />,
    },
    {
      id: 'upi',
      title: t('cart.upiTitle'),
      description: t('cart.upiDesc'),
      icon: <QrCode size={20} className="text-[#1b5e20]" />,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <span className="text-base">💳</span>
        <h3 className="font-extrabold text-sm sm:text-base text-[#1b1c1c]">
          {t('cart.payMethod')}
        </h3>
      </div>

      <div className="bg-white rounded-2xl border border-[#e0e6e0] overflow-hidden divide-y divide-[#e0e6e0] shadow-2xs">
        {paymentOptions.map((opt) => {
          const isSelected = paymentMethod === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => {
                onSelectPaymentMethod(opt.id);
                if (opt.id === 'upi') onOpenUpiModal();
              }}
              className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                isSelected ? 'bg-[#e8f5e9]/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-[#00450d] bg-[#00450d]'
                      : 'border-[#717a6d] bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div>
                  <p className="font-bold text-xs sm:text-sm text-[#1b1c1c]">
                    {opt.title}
                  </p>
                  <p className="text-[11px] text-[#525e54]">
                    {opt.description}
                  </p>
                  {opt.id === 'upi' && isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUpiModal();
                      }}
                      className="text-[11px] font-bold text-[#00450d] underline cursor-pointer mt-0.5"
                    >
                      {t('upi.showQr')}
                    </button>
                  )}
                </div>
              </div>

              <div className="shrink-0">{opt.icon}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

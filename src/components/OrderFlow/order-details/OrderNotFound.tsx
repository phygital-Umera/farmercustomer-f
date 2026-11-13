import React from 'react';
import { useTranslation } from 'react-i18next';

interface OrderNotFoundProps {
  onBack: () => void;
}

export const OrderNotFound: React.FC<OrderNotFoundProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#fcf9f8] min-h-screen px-4 pt-10 text-center">
      <h2 className="text-lg font-bold text-[#1b1c1c]">{t('orderDetails.notFound')}</h2>
      <p className="text-xs text-[#525e54] mt-1">{t('orderDetails.notFoundDesc')}</p>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 bg-[#00450d] text-white font-bold text-xs px-4 py-2 rounded-xl"
      >
        {t('orderDetails.backToOrders')}
      </button>
    </div>
  );
};

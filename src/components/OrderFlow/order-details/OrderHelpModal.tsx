import React from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ContactNumber, ContactNumberList } from './OrderContactCard';

interface OrderHelpModalProps {
  isOpen: boolean;
  orderId: string;
  contactNumbers: ContactNumber[];
  onClose: () => void;
}

export const OrderHelpModal: React.FC<OrderHelpModalProps> = ({
  isOpen,
  orderId,
  contactNumbers,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xs w-full p-5 text-center space-y-3 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center mx-auto">
          <Phone size={22} />
        </div>
        <h3 className="font-bold text-base text-[#1b1c1c]">{t('orderDetails.support')}</h3>
        <p className="text-xs text-[#525e54]">
          {t('orderDetails.supportDesc', { id: orderId })}
        </p>
        {contactNumbers.length > 0 ? (
          <ContactNumberList contactNumbers={contactNumbers} />
        ) : (
          <div className="bg-[#f0eded] rounded-xl p-2.5 font-bold text-xs text-[#00450d]">
            {t('orderDetails.helpline')}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#00450d] text-white font-bold py-2 rounded-xl text-xs"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};

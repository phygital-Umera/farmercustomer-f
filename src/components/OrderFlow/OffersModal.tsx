import React from 'react';
import { X, Tag, Gift, Sparkles, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';

interface OffersModalProps {
  onClose: () => void;
}

export const OffersModal: React.FC<OffersModalProps> = ({ onClose }) => {
  const { discountTotal, hasFreeGift } = useCart();
  const { t } = useTranslation();

  const offers = [
    {
      code: 'MANDIFRESH',
      title: t('offers.fresh.title'),
      description: t('offers.fresh.desc'),
      tag: t('offers.fresh.tag'),
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      code: 'SHAGUN',
      title: t('offers.shagun.title'),
      description: t('offers.shagun.desc'),
      tag: t('offers.shagun.tag'),
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      code: 'FREESHIP',
      title: t('offers.ship.title'),
      description: t('offers.ship.desc'),
      tag: t('offers.ship.tag'),
      color: 'bg-blue-50 text-blue-900 border-blue-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[#00450d]">
            <Tag size={20} />
            <h3 className="font-extrabold text-lg">{t('offers.title')}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className={`p-3.5 rounded-2xl border ${offer.color} space-y-1 relative`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs px-2 py-0.5 rounded bg-black/5 uppercase tracking-wider">
                  {offer.code}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white shadow-2xs">
                  {offer.tag}
                </span>
              </div>
              <h4 className="font-bold text-sm pt-1">{offer.title}</h4>
              <p className="text-xs opacity-90">{offer.description}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#00450d] text-white font-bold py-2.5 rounded-xl cursor-pointer"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};

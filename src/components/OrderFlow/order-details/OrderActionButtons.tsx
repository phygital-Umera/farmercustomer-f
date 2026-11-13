import React from 'react';
import { RotateCw, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ApiOrder } from '@/types/OrderType';

interface OrderActionButtonsProps {
  apiOrder: ApiOrder | undefined;
  isRepeating: boolean;
  downloadSuccess: boolean;
  onRepeatOrder: () => void;
  onDownloadInvoice: () => void;
}

export const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  apiOrder,
  isRepeating,
  downloadSuccess,
  onRepeatOrder,
  onDownloadInvoice,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 pt-1">
      <button
        type="button"
        disabled={!apiOrder || isRepeating}
        onClick={onRepeatOrder}
        className="w-full bg-[#00450d] hover:bg-[#1b5e20] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <RotateCw size={16} className={isRepeating ? 'animate-spin' : ''} />
        <span>{isRepeating ? t('orderDetails.addingToCart') : t('orderDetails.repeat')}</span>
      </button>

      <button
        type="button"
        onClick={onDownloadInvoice}
        className="w-full bg-white hover:bg-[#f9fbf9] text-[#1b1c1c] font-bold py-2.5 rounded-xl border border-[#e0e6e0] flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
      >
        <FileText size={15} className="text-[#1b5e20]" />
        <span>{downloadSuccess ? t('orderDetails.billDownloaded') : t('orderDetails.downloadInvoice')}</span>
      </button>
    </div>
  );
};

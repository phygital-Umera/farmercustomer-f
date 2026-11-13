import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PreorderHeaderProps {
  onBack: () => void;
}

export const PreorderHeader: React.FC<PreorderHeaderProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/[0.04] bg-[#fcf9f8]/95 px-4 py-2.5 backdrop-blur-md">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 cursor-pointer rounded-full p-1 text-[#1b1c1c] transition-colors hover:bg-black/5"
        aria-label={t('common.back')}
      >
        <ArrowLeft size={22} strokeWidth={2.2} />
      </button>
      <div className="leading-tight">
        <h1 className="text-base font-bold tracking-tight text-[#1b1c1c]">
          {t('nav.preorder')}
        </h1>
        <p className="text-[11px] text-[#525e54]">{t('preorder.subtitle')}</p>
      </div>
    </div>
  );
};

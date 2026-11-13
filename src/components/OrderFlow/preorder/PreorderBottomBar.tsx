import React from 'react';
import { CalendarClock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PreorderBottomBarProps {
  totalCount: number;
  hint: string;
  canSave: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export const PreorderBottomBar: React.FC<PreorderBottomBarProps> = ({
  totalCount,
  hint,
  canSave,
  isSaving,
  onSave,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-black/[0.08] bg-white px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0 leading-tight">
          <span className="block text-sm font-black text-[#00450d]">
            {t('orders.itemCount', { count: totalCount })}
          </span>
          <span className="block truncate text-[11px] text-[#525e54]">
            {hint}
          </span>
        </div>
        <button
          type="button"
          disabled={!canSave}
          onClick={onSave}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#00450d] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#1b5e20] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CalendarClock size={15} />
          )}
          {isSaving ? t('preorder.saving') : t('preorder.save')}
        </button>
      </div>
    </div>
  );
};

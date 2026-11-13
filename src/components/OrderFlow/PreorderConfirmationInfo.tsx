import React from 'react';
import {CalendarClock, CheckCircle2, MessageSquareText} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {ApiOrder} from '@/types/OrderType';
import {currentLocale} from '@/i18n';

export const isConfirmedPreorder = (o?: ApiOrder | null): boolean =>
  !!o?.scheduledAt &&
  (!!o.confirmedAt || (o.status || '').toUpperCase() === 'CONFIRMED');

const formatDateTime = (iso?: string | null, withWeekday = false) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString(currentLocale(), {
    ...(withWeekday ? {weekday: 'short' as const} : {}),
    day: 'numeric',
    month: 'short',
  });
  const time = d.toLocaleTimeString(currentLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${date} · ${time}`;
};

/** Small amber chip — same look as the pre-order history card badge. */
export const PreorderChip: React.FC = () => {
  const {t} = useTranslation();
  return (
    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-800">
      {t('nav.preorder')}
    </span>
  );
};

/** Confirmation details: confirmed time, booked delivery slot, store note. */
export const PreorderConfirmationInfo: React.FC<{order: ApiOrder}> = ({
  order,
}) => {
  const {t} = useTranslation();
  return (
    <div className="space-y-1 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[11px] text-emerald-900">
      <p className="flex items-center gap-1.5 font-bold">
        <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
        <span>
          {t('orders.preorderConfirmed')}
          {order.confirmedAt &&
            ` · ${t('orders.confirmedOn', {date: formatDateTime(order.confirmedAt)})}`}
        </span>
      </p>
      <p className="flex items-center gap-1.5 font-semibold">
        <CalendarClock size={13} className="shrink-0 text-emerald-700" />
        {t('orders.scheduledDelivery', {
          when: formatDateTime(order.scheduledAt, true),
        })}
      </p>
      {order.confirmationNote && (
        <p className="flex items-start gap-1.5">
          <MessageSquareText
            size={13}
            className="mt-0.5 shrink-0 text-emerald-700"
          />
          <span>{t('orders.storeNote', {note: order.confirmationNote})}</span>
        </p>
      )}
    </div>
  );
};

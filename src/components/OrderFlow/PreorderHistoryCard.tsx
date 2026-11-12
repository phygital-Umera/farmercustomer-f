import React from 'react';
import {CalendarClock, MapPin} from 'lucide-react';
import {ApiOrder} from '@/types/OrderType';
import {useTranslation} from 'react-i18next';
import {currentLocale} from '@/i18n';

const formatScheduled = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const date = d.toLocaleDateString(currentLocale(), {
    weekday: 'short',
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

const formatAddress = (a: any): string => {
  if (!a) return '';
  if (typeof a === 'string') return a;
  return [a.address, a.landmark, a.pincode].filter(Boolean).join(', ');
};

// Pre-orders never show prices — only products, sizes and counts.
export const PreorderHistoryCard: React.FC<{
  order: ApiOrder;
  statusBadge?: React.ReactNode;
}> = ({order, statusBadge}) => {
  const {t} = useTranslation();
  const shortNo = (order.orderNo || order.id).slice(0, 8).toUpperCase();
  const itemCount = order.items.reduce(
    (s, i) => s + (Number(i.productCount) || 1),
    0,
  );
  const address = formatAddress(order.address);

  return (
    <div className="shadow-2xs space-y-2.5 rounded-2xl border border-amber-200 bg-white p-3.5">
      <div className="flex items-center justify-between gap-2 border-b border-[#e0e6e0]/70 pb-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-800">
            {t('nav.preorder')}
          </span>
          <span className="truncate text-xs font-black text-[#00450d]">
            #{shortNo}
          </span>
        </div>
        <div className="shrink-0">{statusBadge}</div>
      </div>

      {order.scheduledAt && (
        <p className="flex items-center gap-1 text-[11px] font-bold text-[#1b5e20]">
          <CalendarClock size={13} />
          {t('preorder.deliveryOn', {when: formatScheduled(order.scheduledAt)})}
        </p>
      )}

      <ul className="space-y-1 text-xs text-[#1b1c1c]">
        {order.items.map((i, idx) => (
          <li key={i.id || idx} className="truncate capitalize">
            {i.productName}{' '}
            <span className="text-[#525e54]">{i.productQuantity}</span> ×{' '}
            <span className="font-semibold">{i.productCount}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between gap-3 border-t border-[#e0e6e0]/70 pt-2">
        <p className="flex min-w-0 items-start gap-1 text-[11px] text-[#525e54]">
          {address && (
            <>
              <MapPin size={12} className="mt-0.5 shrink-0" />
              <span className="truncate">{address}</span>
            </>
          )}
        </p>
        <span className="shrink-0 text-xs font-black text-[#00450d]">
          {t('orders.itemCount', {count: itemCount})}
        </span>
      </div>
    </div>
  );
};

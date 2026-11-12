import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  RotateCw,
  ChevronRight,
  Zap,
  Store,
  AlertCircle,
  Truck,
  LogIn,
} from 'lucide-react';
import { Link,  Navigate } from '@tanstack/react-router';
import { ApiOrder } from '@/types/OrderType';
import { useGetOrder } from '@/lib/api and mutation/Order/useOrder';
import { useRepeatOrder } from '@/lib/api and mutation/Order/useRepeatOrder';
import { useAuthContext } from '@/context/AuthContext';
import { PreorderHistoryCard } from './PreorderHistoryCard';
import { useTranslation } from 'react-i18next';
import { currentLocale } from '@/i18n';

interface OrdersPageProps {
  onBack: () => void;
  onViewOrderDetails: (orderId: string) => void;
  onGoToShop: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onBack,
  onViewOrderDetails,
  onGoToShop,
}) => {
  const { repeatOrder, isRepeating } = useRepeatOrder();
  const { t } = useTranslation();
  const { data: orderData, isLoading, isError, error, refetch } = useGetOrder();

  const {isAuthenticated} = useAuthContext()

  if (!isAuthenticated) {
    return (
      <div className="bg-[#fcf9f8] min-h-screen flex flex-col">
        {/* Top Header with Back */}
        <div className="sticky top-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="p-1 -ml-1 text-[#1b1c1c] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
              aria-label={t('common.back')}
            >
              <ArrowLeft size={22} strokeWidth={2.2} />
            </button>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-[#1b1c1c] tracking-tight">
                {t('orders.title')}
              </h1>
              <p className="text-[11px] text-[#525e54]">
                {t('orders.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Centered Login Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white rounded-3xl border border-[#e0e6e0] p-6 sm:p-8 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center mx-auto shadow-inner">
              <LogIn size={30} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1b1c1c]">
                {t('orders.loginTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[#525e54] leading-relaxed">
                {t('orders.loginDesc')}
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <Link
                to="/signin"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#00450d] hover:bg-[#1b5e20] active:scale-[0.98] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <LogIn size={16} />
                <span>{t('orders.loginButton')}</span>
              </Link>

              <button
                type="button"
                onClick={onGoToShop}
                className="w-full text-xs font-semibold text-[#525e54] hover:text-[#00450d] py-1.5 transition-colors cursor-pointer"
              >
                {t('orders.continueShopping')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safely extract orders array from API response
  const orders: ApiOrder[] = React.useMemo(() => {
    if (!orderData) return [];
    const raw = orderData as any;
    if (Array.isArray(raw?.data?.orders)) return raw.data.orders;
    if (Array.isArray(raw?.orders)) return raw.orders;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  }, [orderData]);

  // Pre-orders come from the same API (orderType: 'PREORDER')
  const preorders = orders
    .filter((o) => o.orderType === 'PREORDER')
    .sort((a, b) =>
      (a.scheduledAt || '').localeCompare(b.scheduledAt || '')
    );
  const normalOrders = orders.filter((o) => o.orderType !== 'PREORDER');

  // Format date helper: "16 Oct 2026, 05:30 PM"
  const formatOrderDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString(currentLocale(), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Status badge helper
  const renderStatusBadge = (status?: string) => {
    const norm = (status || '').toUpperCase();

    switch (norm) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <Clock size={12} className="text-amber-600" />
            <span>{t('orders.status.pending')}</span>
          </span>
        );
      case 'PACKED':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <Package size={12} className="text-blue-600" />
            <span>{t('orders.status.packed')}</span>
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 border border-indigo-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <Truck size={12} className="text-indigo-600" />
            <span>{t('orders.status.assigned')}</span>
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
            <Zap size={12} fill="currentColor" className="text-emerald-600" />
            <span>{t('orders.status.onTheWay')}</span>
          </span>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>{t('orders.status.delivered')}</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <span>{t('orders.status.cancelled')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            <span>{status || t('orders.status.placed')}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen pb-28">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-[#1b1c1c] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            aria-label={t('common.back')}
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </button>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-[#1b1c1c] tracking-tight">
              {t('orders.title')}
            </h1>
            <p className="text-[11px] text-[#525e54]">
              {t('orders.subtitle')}
            </p>
          </div>
        </div>

        <span className="bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold px-2.5 py-1 rounded-full border border-[#2e7d32]/20">
          {t('orders.count', { count: orders.length })}
        </span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-3 space-y-3.5">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#e0e6e0] p-4 space-y-3 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-5 bg-gray-200 rounded-full w-16" />
                </div>
                <div className="h-14 bg-gray-100 rounded-xl" />
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-7 bg-gray-200 rounded-lg w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-2">
            <AlertCircle size={28} className="text-red-500 mx-auto" />
            <h3 className="font-bold text-sm text-red-900">{t('orders.loadError')}</h3>
            <p className="text-xs text-red-700">
              {(error as any)?.response?.data?.message || (error as any)?.message || t('orders.tryAgainDesc')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              {t('orders.tryAgain')}
            </button>
          </div>
        )}

        {/* Pre-orders (Scheduled) */}
        {!isLoading && !isError && preorders.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="font-extrabold text-sm text-[#1b1c1c]">
              {t('orders.preordersTitle')} <span className="text-xs font-normal text-[#525e54]">{t('orders.scheduled')}</span>
            </h2>
            {preorders.map((p) => (
              <PreorderHistoryCard
                key={p.id}
                order={p}
                statusBadge={renderStatusBadge(p.status)}
              />
            ))}
            {normalOrders.length > 0 && (
              <h2 className="font-extrabold text-sm text-[#1b1c1c] pt-2">{t('orders.pastOrders')}</h2>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && orders.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center mx-auto mb-3">
              <Package size={32} />
            </div>
            <h2 className="text-base font-bold text-[#1b1c1c]">{t('orders.emptyTitle')}</h2>
            <p className="text-xs text-[#525e54] mt-1 max-w-xs mx-auto">
              {t('orders.emptyDesc')}
            </p>
            <button
              type="button"
              onClick={onGoToShop}
              className="mt-4 bg-[#00450d] hover:bg-[#1b5e20] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer transition-colors"
            >
              {t('cart.browse')}
            </button>
          </div>
        )}

        {/* Orders List */}
        {!isLoading &&
          !isError &&
          normalOrders.map((order) => {
            const shortOrderNo = order.orderNo
              ? order.orderNo.slice(0, 8).toUpperCase()
              : order.id.slice(0, 8).toUpperCase();

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#e0e6e0] p-3.5 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                {/* Order Top Bar: Short Order #, Date, Status */}
                <div className="flex items-center justify-between pb-2 border-b border-[#e0e6e0]/70">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-xs text-[#00450d]">
                        #{shortOrderNo}
                      </span>
                      <span className="text-[11px] text-[#717a6d]">
                        • {formatOrderDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {renderStatusBadge(order.status)}
                  </div>
                </div>

                {/* Seller / Mandi Partner (if available) */}
                {/* {order.admin?.user?.fullname && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#525e54] bg-[#f9fbf9] px-2.5 py-1 rounded-lg w-fit border border-[#e0e6e0]/60">
                    <Store size={12} className="text-[#1b5e20] shrink-0" />
                    <span>
                      Mandi: <strong className="text-[#1b1c1c] font-semibold">{order.admin.user.fullname}</strong>
                    </span>
                  </div>
                )} */}

                {/* Items Summary */}
                <div className="bg-[#f9fbf9] rounded-xl p-2.5 border border-[#e0e6e0]/60 space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex items-center justify-between text-xs gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                          {item.productName?.charAt(0) || 'P'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1b1c1c] capitalize truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-[#525e54]">
                            {t('orders.kg', { qty: item.totalQuantity || item.productQuantity })}
                            {item.productCount ? ` • ${t('orders.qty', { count: item.productCount })}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-[#1b1c1c]">
                          ₹{Number(item.totalPrice ?? item.subtotal).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill / Grand Total Summary */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div>
                    <span className="text-[11px] text-[#525e54]">
                      {t('orders.itemCount', { count: order.items.length })}
                      {order.totalTax > 0 && ` • ${t('orders.tax', { amount: Number(order.totalTax).toFixed(2) })}`}
                    </span>
                    <div className="font-bold text-xs text-[#1b1c1c]">{t('orders.grandTotal')}</div>
                    {order.note && (<span>{t('orders.note', { note: order.note })}</span>)}
                  </div>

                  <div className="text-right">
                    <div className="font-black text-base text-[#00450d]">
                      ₹{Number(order.grandTotal).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Actions: Repeat Order & View Details */}
                <div className="pt-2 border-t border-[#e0e6e0]/70 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={isRepeating}
                    onClick={() => repeatOrder(order)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#1b5e20] hover:bg-[#e8f5e9] px-3 py-1.5 rounded-lg border border-[#2e7d32]/30 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <RotateCw size={13} className={isRepeating ? 'animate-spin' : ''} />
                    <span>{isRepeating ? t('common.adding') : t('orders.repeat')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewOrderDetails(order.id)}
                    className="flex items-center gap-1 bg-[#00450d] hover:bg-[#1b5e20] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-transform active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <span>{t('orders.viewMore')}</span>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

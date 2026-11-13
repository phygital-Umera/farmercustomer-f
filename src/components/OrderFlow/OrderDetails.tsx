import React from 'react';
import {
  PreorderConfirmationInfo,
  isConfirmedPreorder,
} from './PreorderConfirmationInfo';
import {
  OrderNotFound,
  OrderDetailsHeader,
  OrderStatusTracker,
  OrderItemsList,
  OrderDeliveryInfo,
  OrderContactCard,
  OrderBillBreakdown,
  OrderActionButtons,
  OrderHelpModal,
  useOrderDetailsData,
} from './order-details';

interface OrderDetailsPageProps {
  orderId: string;
  onBack: () => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({
  orderId,
  onBack,
}) => {
  const {
    order,
    apiOrder,
    isLive,
    contactNumbers,
    downloadSuccess,
    showHelpAlert,
    setShowHelpAlert,
    isRepeating,
    handleDownloadInvoice,
    handleRepeatOrder,
    instructionInfo,
  } = useOrderDetailsData(orderId);

  if (!order) {
    return <OrderNotFound onBack={onBack} />;
  }

  return (
    <div className="bg-[#fcf9f8] min-h-screen pb-28">
      {/* Top Header */}
      <OrderDetailsHeader
        orderId={order.id}
        placedAt={order.placedAt}
        onBack={onBack}
        onOpenHelp={() => setShowHelpAlert(true)}
      />

      <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Confirmed pre-order details */}
        {apiOrder && isConfirmedPreorder(apiOrder) && (
          <PreorderConfirmationInfo order={apiOrder} />
        )}

        {/* Status Tracker Banner */}
        <OrderStatusTracker order={order} isLive={isLive} />

        {/* All Items in This Order */}
        <OrderItemsList items={order.items} />

        {/* Delivery Address & Instructions */}
        <OrderDeliveryInfo order={order} instructionInfo={instructionInfo} />

        {/* Store contact numbers */}
        <OrderContactCard contactNumbers={contactNumbers} />

        {/* Bill Breakdown */}
        <OrderBillBreakdown order={order} />

        {/* Action Buttons: Repeat Order & Download Invoice */}
        <OrderActionButtons
          apiOrder={apiOrder}
          isRepeating={isRepeating}
          downloadSuccess={downloadSuccess}
          onRepeatOrder={handleRepeatOrder}
          onDownloadInvoice={handleDownloadInvoice}
        />
      </div>

      {/* Help Alert Modal */}
      <OrderHelpModal
        isOpen={showHelpAlert}
        orderId={order.id}
        contactNumbers={contactNumbers}
        onClose={() => setShowHelpAlert(false)}
      />
    </div>
  );
};

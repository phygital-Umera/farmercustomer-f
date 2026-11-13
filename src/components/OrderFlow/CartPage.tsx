import React from 'react';
import { SearchBar } from './SearchBar';
import { UpiQrModal } from './UpiQrModal';
import {
  CartEmptyState,
  CartHeader,
  CartAddressCard,
  CartItemList,
  CartBillDetails,
  CartPaymentSelector,
  CartBottomBar,
  CartBillDetailModal,
  useCartPageData,
} from './cart';

export interface CartPageProps {
  onBack: () => void;
  onOpenAddressModal: () => void;
  onPlaceOrder: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onBack,
  onOpenAddressModal,
}) => {
  const {
    addressList,
    selectedAddress,
    addressId,
    handleSelectAddress,
    handlePlaceOrder,
    isPending,
    searchQuery,
    setSearchQuery,
    activeDisplayItems,
    filteredDisplayItems,
    displayTotalCount,
    displayItemsTotal,
    displayFinalToPay,
    handleQuantityChange,
    paymentMethod,
    setPaymentMethod,
    showBillDetailModal,
    setShowBillDetailModal,
    showUpiModal,
    setShowUpiModal,
  } = useCartPageData({ onOpenAddressModal });

  if (activeDisplayItems.length === 0) {
    return <CartEmptyState onBack={onBack} />;
  }

  return (
    <div className="bg-[#fcf9f8] min-h-screen pb-44">
      {/* Search Header Container */}
      <div className="px-4 pt-2 pb-2 bg-[#fcf9f8]">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="max-w-md mx-auto px-4 space-y-2">
        {/* Title & Back Button */}
        <CartHeader onBack={onBack} />

        {/* Delivery Address Card */}
        <CartAddressCard
          addressList={addressList}
          selectedAddress={selectedAddress}
          selectedAddressId={addressId}
          onSelectAddress={handleSelectAddress}
          onOpenAddressModal={onOpenAddressModal}
        />

        {/* Selected Items List */}
        <CartItemList
          items={filteredDisplayItems}
          onQuantityChange={handleQuantityChange}
        />

        {/* Bill Details */}
        <CartBillDetails
          totalCount={displayTotalCount}
          itemsTotal={displayItemsTotal}
          finalToPay={displayFinalToPay}
        />

        {/* Payment Options */}
        <CartPaymentSelector
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          onOpenUpiModal={() => setShowUpiModal(true)}
        />
      </div>

      {/* Sticky Bottom Order Bar */}
      <CartBottomBar
        finalToPay={displayFinalToPay}
        showBillDetailModal={showBillDetailModal}
        onToggleBillDetailModal={() => setShowBillDetailModal(!showBillDetailModal)}
        onPlaceOrder={handlePlaceOrder}
        isPending={isPending}
        paymentMethod={paymentMethod}
      />

      {/* UPI QR popup (only for the UPI option) */}
      {showUpiModal && (
        <UpiQrModal
          amount={displayFinalToPay}
          onClose={() => setShowUpiModal(false)}
        />
      )}

      {/* Bill Details Bottom Sheet Modal */}
      <CartBillDetailModal
        isOpen={showBillDetailModal}
        onClose={() => setShowBillDetailModal(false)}
        itemsTotal={displayItemsTotal}
        finalToPay={displayFinalToPay}
      />
    </div>
  );
};

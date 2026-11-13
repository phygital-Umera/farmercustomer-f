import React from 'react';
import { AddressModal } from './AddressModal';
import {
  PreorderHeader,
  PreorderLoginPrompt,
  PreorderScheduleAddressCard,
  PreorderProductList,
  PreorderBottomBar,
  usePreorderPageData,
} from './preorder';

interface PreorderPageProps {
  onBack: () => void;
}

export const PreorderPage: React.FC<PreorderPageProps> = ({ onBack }) => {
  const {
    isAuthenticated,
    todayIso,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    scheduleChosen,
    isFuture,
    showAddressModal,
    setShowAddressModal,
    addressList,
    selectedAddress,
    addressId,
    handleSelectAddress,
    searchQuery,
    setSearchQuery,
    productsLoading,
    filteredProducts,
    selectedWeights,
    handleSelectWeight,
    quantities,
    changeQty,
    totalCount,
    hint,
    canSave,
    isSaving,
    handleSave,
  } = usePreorderPageData();

  if (!isAuthenticated) {
    return <PreorderLoginPrompt onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] pb-36">
      <PreorderHeader onBack={onBack} />

      <div className="space-y-3 px-4 pt-2.5">
        {/* Compact schedule + address card */}
        <PreorderScheduleAddressCard
          deliveryDate={deliveryDate}
          setDeliveryDate={setDeliveryDate}
          deliveryTime={deliveryTime}
          setDeliveryTime={setDeliveryTime}
          todayIso={todayIso}
          scheduleChosen={scheduleChosen}
          isFuture={isFuture}
          addressList={addressList}
          selectedAddress={selectedAddress}
          addressId={addressId}
          onSelectAddress={handleSelectAddress}
          onOpenAddressModal={() => setShowAddressModal(true)}
        />

        {/* Products list with search */}
        <PreorderProductList
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={productsLoading}
          products={filteredProducts}
          selectedWeights={selectedWeights}
          onSelectWeight={handleSelectWeight}
          quantities={quantities}
          onChangeQty={changeQty}
        />
      </div>

      {/* Sticky save bar */}
      <PreorderBottomBar
        totalCount={totalCount}
        hint={hint}
        canSave={canSave}
        isSaving={isSaving}
        onSave={handleSave}
      />

      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} />
      )}
    </div>
  );
};

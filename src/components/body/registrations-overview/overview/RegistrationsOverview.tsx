import React from "react";
import { RegistrationsOverviewFilterForm } from "./RegistrationsOverviewFilterForm";
import { RegistrationsOverviewTable } from "./RegistrationsOverviewTable";
import { useRegistrationsOverview } from "./useRegistrationsOverview";

export const RegistrationsOverview: React.FC = () => {
  const {
    termOptions,
    isLoading,
    filterState,
    registrations,
    pagination,
    error,

    handleReset,
    handleSubmit,
    updateFilterState,
    updatePaginationState,
  } = useRegistrationsOverview();

  return (
    <>
      <RegistrationsOverviewFilterForm
        onReset={handleReset}
        onSubmit={handleSubmit}
        filterState={filterState.dataFilterParams}
        updateFilterState={updateFilterState}
        loading={isLoading}
        termsOptions={termOptions}
        error={error}
      />

      <RegistrationsOverviewTable
        data={registrations}
        updatePagination={updatePaginationState}
        paginationState={filterState.paginationsParams}
        total={pagination.total}
        isLoading={isLoading}
      />
    </>
  );
};

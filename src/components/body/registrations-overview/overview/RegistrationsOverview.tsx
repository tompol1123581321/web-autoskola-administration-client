import React from "react";
import { Row, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RegistrationsOverviewFilterForm } from "./RegistrationsOverviewFilterForm";
import { RegistrationsOverviewTable } from "./RegistrationsOverviewTable";
import { useRegistrationsOverview } from "./useRegistrationsOverview";

export const RegistrationsOverview: React.FC = () => {
  const {
    termOptions,
    isLoading,
    filterState,
    registrations,

    onAdd,
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
      />

      <Row align="middle" justify="start" className="my-2 mx-4">
        <Button onClick={onAdd} icon={<PlusOutlined />}>
          Přidat
        </Button>
      </Row>

      <RegistrationsOverviewTable
        data={registrations}
        updatePagination={updatePaginationState}
        paginationState={filterState.paginationsParams}
        isLoading={isLoading}
      />
    </>
  );
};

import { PlusOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";
import { RegistrationsOverviewFilterForm } from "./RegistrationsOverviewFilterForm";
import { RegistrationsOverviewTable } from "./RegistrationsOverviewTable";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useRegistrationsService } from "../../../../services/useRegistrationsService";
import {
  RegistrationsFilter,
  RegistrationFormData,
  RegistrationFormDataFilter,
  RegistrationsPaginationParams,
  TermOption,
} from "autoskola-web-shared-models";

const DEFAULT_FILTER_STATE: RegistrationsFilter = {
  dataFilterParams: { activeTerms: true },
  paginationsParams: { page: 1, pageSize: 10 },
  sortParams: { direction: "DESC", key: "registrationDate" },
};

export const RegistrationsOverview = () => {
  const { getRegistrations, getRegistrationOptions } =
    useRegistrationsService();
  const [termOptions, setTermOptions] = useState<Array<TermOption>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterState, setFilterState] =
    useState<RegistrationsFilter>(DEFAULT_FILTER_STATE);
  const [registrations, setRegistrations] = useState<
    Array<RegistrationFormData>
  >([]);
  const navigate = useNavigate();

  const loadTermOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const options = await getRegistrationOptions();
      setTermOptions(options);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [getRegistrationOptions]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRegistrations(filterState);
      setRegistrations(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [getRegistrations, filterState]);

  useEffect(() => {
    loadTermOptions();
    handleSubmit();
  }, []);

  const onAdd = () => {
    navigate("/app/registration-detail/add");
  };

  const updateFilterState = (filter: RegistrationFormDataFilter) => {
    setFilterState((prev) => ({ ...prev, dataFilterParams: filter }));
  };

  const updatePaginationState = (pagination: RegistrationsPaginationParams) => {
    setFilterState((prev) => ({ ...prev, paginationsParams: pagination }));
  };

  const handleReset = () => {
    setFilterState(DEFAULT_FILTER_STATE);
  };

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
      <Row align={"middle"} justify={"start"} className="my-2 mx-4">
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

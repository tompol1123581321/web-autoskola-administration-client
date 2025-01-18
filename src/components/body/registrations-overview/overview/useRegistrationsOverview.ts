import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export const useRegistrationsOverview = () => {
  const { getRegistrations, getRegistrationOptions } =
    useRegistrationsService();
  const navigate = useNavigate();

  const [termOptions, setTermOptions] = useState<Array<TermOption>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterState, setFilterState] =
    useState<RegistrationsFilter>(DEFAULT_FILTER_STATE);
  const [registrations, setRegistrations] = useState<
    Array<RegistrationFormData>
  >([]);

  const loadTermOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const options = await getRegistrationOptions();
      setTermOptions(options);
    } catch (error) {
      console.error("Error loading term options:", error);
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
      console.error("Error fetching registrations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getRegistrations, filterState]);

  useEffect(() => {
    loadTermOptions();
    handleSubmit();
  }, []);

  const onAdd = () => {
    navigate("/app/registration-detail/add/none");
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

  return {
    termOptions,
    isLoading,
    filterState,
    registrations,
    onAdd,
    handleReset,
    handleSubmit,
    updateFilterState,
    updatePaginationState,
  };
};

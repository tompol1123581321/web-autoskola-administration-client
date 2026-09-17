import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistrationsService } from "../../../../services/useRegistrationsService";
import { TermOption } from "autoskola-web-shared-models";
import { RegistrationSearchParams } from "../../../../services/useRegistrationsService";
import { AdminRegistration } from "../../../../services/useRegistrationsService";

const DEFAULT_FILTER_STATE: RegistrationSearchParams = {
  dataFilterParams: {},
  paginationsParams: { page: 1, pageSize: 20 },
  sortParams: { direction: "DESC", key: "registrationDate" },
};

export const useRegistrationsOverview = () => {
  const { getRegistrations, getRegistrationOptions } =
    useRegistrationsService();
  const navigate = useNavigate();

  const [termOptions, setTermOptions] = useState<Array<TermOption>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterState, setFilterState] = useState<RegistrationSearchParams>(DEFAULT_FILTER_STATE);
  const [registrations, setRegistrations] = useState<
    Array<AdminRegistration>
  >([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [error, setError] = useState("");

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
    setError("");
    try {
      const response = await getRegistrations(filterState);
      setRegistrations(response.data);
      setPagination({ total: response.total, totalPages: response.totalPages });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Nepodařilo se načíst registrace.");
    } finally {
      setIsLoading(false);
    }
  }, [getRegistrations, filterState]);

  useEffect(() => {
    loadTermOptions();
  }, [loadTermOptions]);

  useEffect(() => {
    const timeout = window.setTimeout(handleSubmit, filterState.dataFilterParams.userSearch ? 350 : 0);
    return () => window.clearTimeout(timeout);
  }, [filterState, handleSubmit]);

  const onAdd = () => {
    navigate("/app/registration-detail/add/none");
  };

  const updateFilterState = (filter: RegistrationSearchParams["dataFilterParams"]) => {
    setFilterState((prev) => ({ ...prev, dataFilterParams: filter, paginationsParams: { ...prev.paginationsParams, page: 1 } }));
  };

  const updatePaginationState = (nextPagination: RegistrationSearchParams["paginationsParams"]) => {
    setFilterState((prev) => ({ ...prev, paginationsParams: nextPagination }));
  };

  const handleReset = () => {
    setFilterState(DEFAULT_FILTER_STATE);
  };

  return {
    termOptions,
    isLoading,
    filterState,
    registrations,
    pagination,
    error,
    onAdd,
    handleReset,
    handleSubmit,
    updateFilterState,
    updatePaginationState,
  };
};

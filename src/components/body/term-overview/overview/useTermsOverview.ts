import { Term, TermFilter } from "autoskola-web-shared-models";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTermsService } from "../../../../services/useTermsService";

const DEAFAULT_FILTER: TermFilter = {
  created: undefined,
  isActive: true,
  nameContains: "",
};

export const useTermsOverview = () => {
  const [data, setData] = useState<Array<Term>>([]);
  const [filterState, setFilterState] = useState<TermFilter>(DEAFAULT_FILTER);
  const navigate = useNavigate();
  const { getTerms } = useTermsService();
  const [isLoading, setIsLoading] = useState(false);

  const onAdd = () => {
    navigate("/app/terms/term-detail/add");
  };

  const loadTerms = useCallback(
    async (filter: TermFilter) => {
      try {
        setIsLoading(true);
        const terms = await getTerms(filter);
        setData(terms);
      } catch (e) {
        console.log(e);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [getTerms]
  );

  useEffect(() => {
    loadTerms(filterState);
  }, []);

  const onReset = () => {
    setFilterState(DEAFAULT_FILTER);
    loadTerms(DEAFAULT_FILTER);
  };

  return {
    onReset,
    loadTerms,
    isLoading,
    data,
    filterState,
    setFilterState,
    onAdd,
  };
};

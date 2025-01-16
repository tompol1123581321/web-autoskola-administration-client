import { PlusOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";
import { TermsOverviewFilterForm } from "./TermsOverviewFilterForm";
import { TermsOverviewTable } from "./TermsOverviewTable";
import { useNavigate } from "react-router-dom";
import { useTermsService } from "../../../../services/useTermsService";
import { useCallback, useEffect, useState } from "react";
import { Term, TermFilter } from "autoskola-web-shared-models";

const DEAFAULT_FILTER: TermFilter = {
  created: undefined,
  isActive: true,
  nameContains: "",
};

export const TermsOverview = () => {
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

  return (
    <>
      <TermsOverviewFilterForm
        onReset={onReset}
        onSubmit={loadTerms}
        filterState={filterState}
        updateFilterState={setFilterState}
        loading={isLoading}
      />
      <Row align={"middle"} justify={"start"} className="my-2 mx-4">
        <Button onClick={onAdd} icon={<PlusOutlined />}>
          Přidat
        </Button>
      </Row>

      <TermsOverviewTable data={data} isLoading={isLoading} />
    </>
  );
};

import { PlusOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";
import { TermsOverviewFilterForm } from "./TermsOverviewFilterForm";
import { TermsOverviewTable } from "./TermsOverviewTable";
import { useNavigate } from "react-router-dom";
import { useTermsService } from "../../../../services/useTermsService";
import { useCallback, useEffect, useState } from "react";
import { Term, TermFilter } from "autoskola-web-shared-models";

export const TermsOverview = () => {
  const [data, setData] = useState<Array<Term>>([]);
  const [filter, setFilter] = useState<TermFilter>({});
  const navigate = useNavigate();
  const { getTerms } = useTermsService();
  const [isLoading, setIsLoading] = useState(false);
  const onAdd = () => {
    navigate("/app/terms/term-detail/add");
  };

  const loadTerms = useCallback(async () => {
    const terms = await getTerms(filter);
    setData(terms);
  }, [filter, getTerms]);

  const onReset = () => setFilter({});

  return (
    <>
      <TermsOverviewFilterForm
        onReset={onReset}
        onSubmit={loadTerms}
        filterState={filter}
        updateFilterState={setFilter}
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

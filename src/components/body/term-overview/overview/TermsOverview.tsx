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
  const [filter, setFilter] = useState<TermFilter>({ isActive: true });
  const navigate = useNavigate();
  const { getTerms } = useTermsService();
  const [isLoading, setIsLoading] = useState(false);
  const onAdd = () => {
    navigate("/app/terms/term-detail/add");
  };

  const loadTerms = useCallback(async () => {
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
  }, [filter, getTerms]);

  useEffect(() => {
    loadTerms();
  }, []);

  const onReset = () => setFilter({ isActive: true });

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

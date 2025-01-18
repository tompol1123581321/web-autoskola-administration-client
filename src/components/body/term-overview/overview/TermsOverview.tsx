import { PlusOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";
import { TermsOverviewFilterForm } from "./TermsOverviewFilterForm";
import { TermsOverviewTable } from "./TermsOverviewTable";
import { useTermsOverview } from "./useTermsOverview";

export const TermsOverview = () => {
  const {
    data,
    filterState,
    isLoading,
    loadTerms,
    onAdd,
    onReset,
    setFilterState,
  } = useTermsOverview();

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

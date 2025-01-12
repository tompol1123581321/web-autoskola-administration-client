import { PlusOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";
import { TermsOverviewFilterForm } from "./TermsOverviewFilterForm";
import { TermsOverviewTable } from "./TermsOverviewTable";
import { useNavigate } from "react-router-dom";

export const TermsOverview = () => {
  const navigate = useNavigate();

  const onAdd = () => {
    navigate("/app/terms/term-detail/add");
  };

  return (
    <>
      <TermsOverviewFilterForm
        onReset={console.log}
        onSubmit={console.log}
        filterState={{} as any}
        updateFilterState={console.log}
        loading={false}
        termsOptions={[]}
      />
      <Row align={"middle"} justify={"start"} className="my-2 mx-4">
        <Button onClick={onAdd} icon={<PlusOutlined />}>
          Přidat
        </Button>
      </Row>

      <TermsOverviewTable />
    </>
  );
};

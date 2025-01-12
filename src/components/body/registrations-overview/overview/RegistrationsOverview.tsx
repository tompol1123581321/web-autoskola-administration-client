import { PlusOutlined } from "@ant-design/icons";
import { Row, Button } from "antd";
import { RegistrationsOverviewFilterForm } from "./RegistrationsOverviewFilterForm";
import { RegistrationsOverviewTable } from "./RegistrationsOverviewTable";
import { useNavigate } from "react-router-dom";

export const RegistrationsOverview = () => {
  const navigate = useNavigate();

  const onAdd = () => {
    navigate("/app/registration-detail/add");
  };

  return (
    <>
      <RegistrationsOverviewFilterForm
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

      <RegistrationsOverviewTable />
    </>
  );
};

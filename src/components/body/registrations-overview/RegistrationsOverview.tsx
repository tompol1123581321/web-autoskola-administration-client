import {
  FilterOutlined,
  ClearOutlined,
  PlusCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Row, Col, Button, Space } from "antd";
import { RegistrationsOverviewFilterForm } from "./RegistrationsOverviewFilterForm";
import { RegistrationsOverviewTable } from "./RegistrationsOverviewTable";

export const RegistrationsOverview = () => {
  return (
    <>
      <RegistrationsOverviewFilterForm
        onReset={console.log}
        onSubmit={console.log}
        filterState={{} as any}
        updateFilterState={console.log}
      />
      <Row align={"middle"} justify={"start"} className="my-2 mx-4">
        <Button icon={<PlusOutlined />}>Přidat</Button>
      </Row>

      <RegistrationsOverviewTable />
    </>
  );
};

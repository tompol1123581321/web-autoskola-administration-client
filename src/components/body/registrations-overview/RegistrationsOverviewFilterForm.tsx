import { RegistrationFormData } from "autoskola-web-shared-models";
import React from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Card,
  Space,
} from "antd";
import { ClearOutlined, FilterFilled } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

type Props = {
  filterState: Partial<RegistrationFormData>;
  updateFilterState: (filterState: Partial<RegistrationFormData>) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export const RegistrationsOverviewFilterForm: React.FC<Props> = ({
  filterState,
  updateFilterState,
  onSubmit,
  onReset,
}) => {
  const handleInputChange = (key: keyof RegistrationFormData, value: any) => {
    updateFilterState({
      ...filterState,
      [key]: value,
    });
  };

  // Handler for clearing filters
  const handleClear = () => {
    onReset();
  };

  return (
    <Card
      className="filter-card"
      style={{
        maxWidth: "100%",
        padding: "24px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Form layout="vertical" size="large" onFinish={onSubmit}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Jméno" name="firstName">
              <Input
                placeholder="Jan"
                allowClear
                value={filterState.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Příjmení" name="lastName">
              <Input
                placeholder="Novák"
                allowClear
                value={filterState.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Email" name="email">
              <Input
                placeholder="jan.novak@seznam.cz"
                inputMode="email"
                allowClear
                value={filterState.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Termín" name="term">
              <Select
                placeholder="Březen 2025"
                allowClear
                showSearch
                mode="multiple"
                // value={filterState.term}
                // onChange={(value) => handleInputChange("term", value)}
              >
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Telefoní číslo" name="phoneNumber">
              <Input
                placeholder="606413772"
                inputMode="tel"
                allowClear
                value={filterState.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label="Datum registrace (od - do)"
              name="registrationDate"
            >
              <RangePicker
                style={{ width: "100%" }}
                placeholder={["Od", "do"]}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Typ vozidla" name="type">
              <Select
                placeholder="B"
                allowClear
                mode="multiple"
                value={filterState.type}
                onChange={(value) => handleInputChange("type", value)}
              >
                <Option value="car">Car</Option>
                <Option value="motorcycle">Motorcycle</Option>
                <Option value="truck">Truck</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Poznámky obsahují" name="notes">
              <Input
                placeholder="...."
                allowClear
                value={filterState.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: "16px" }}>
          <Space>
            <Button type="default" icon={<FilterFilled />} htmlType="submit">
              Filtrovat
            </Button>
            <Button
              danger
              type="default"
              icon={<ClearOutlined />}
              onClick={handleClear}
            >
              Reset
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );
};

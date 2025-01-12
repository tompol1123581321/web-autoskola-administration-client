// components/body/registrations-overview/RegistrationsOverviewFilterForm.tsx

import React, { useCallback } from "react";
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
  Checkbox,
  Alert,
} from "antd";
import { ClearOutlined, FilterFilled } from "@ant-design/icons";
import { RegistrationsFilter } from "autoskola-web-shared-models";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

type TermOption = {
  termId: string;
  termName: string;
};

type Props = {
  filterState: RegistrationsFilter["dataFilterParams"];
  updateFilterState: (
    filterState: RegistrationsFilter["dataFilterParams"]
  ) => void;
  onSubmit: () => void;
  onReset: () => void;
  termsOptions: TermOption[]; // Pole termínů pro Select komponentu
  loading: boolean; // Indikuje, zda formulář právě odesílá data
  error?: string; // Nepovinná chybová zpráva
};

export const RegistrationsOverviewFilterForm: React.FC<Props> = ({
  filterState,
  updateFilterState,
  onSubmit,
  onReset,
  termsOptions,
  loading,
  error,
}) => {
  /**
   * Zpracovává změny v poli formuláře a aktualizuje stav filtru.
   *
   * @param key - Klíč ve stavu filtru, který se aktualizuje.
   * @param value - Nová hodnota pro daný klíč.
   */
  const handleInputChange = useCallback(
    (key: keyof RegistrationsFilter["dataFilterParams"], value: any) => {
      updateFilterState({
        ...filterState,
        [key]: value,
      });
    },
    [filterState, updateFilterState]
  );

  /**
   * Resetuje všechny filtry do jejich výchozího stavu.
   */
  const handleClear = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <Card
      className="filter-card"
      style={{
        maxWidth: "100%",
        padding: "24px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
      aria-label="Filtrovat registrace"
    >
      <Form layout="vertical" size="large" onFinish={onSubmit}>
        {/* Zobrazení chybové zprávy, pokud existuje */}
        {error && (
          <Alert
            message="Chyba"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "16px" }}
            onClose={() => {}}
          />
        )}

        <Row gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Hledat uživatele" name="userSearch">
              <Input
                placeholder="Hledat podle jména, emailu atd."
                allowClear
                value={filterState.userSearch}
                onChange={(e) =>
                  handleInputChange("userSearch", e.target.value)
                }
                aria-label="Hledat uživatele"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Vybrat termín" name="termId">
              <Select
                showSearch
                placeholder="Vyberte termín"
                allowClear
                optionFilterProp="children"
                value={filterState.termId}
                onChange={(value) => handleInputChange("termId", value)}
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                aria-label="Vybrat termín"
              >
                {termsOptions.map((term) => (
                  <Option key={term.termId} value={term.termId}>
                    {term.termName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={8} md={8}>
            <Form.Item>
              <Checkbox
                checked={filterState.activeTerms}
                onChange={(e) =>
                  handleInputChange("activeTerms", e.target.checked)
                }
                aria-label="Filtrovat aktivní termíny"
              >
                Pouze aktivní termíny
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} sm={16} md={8}>
            <Form.Item
              label="Datum registrace (od - do)"
              name="registrationDate"
            >
              <RangePicker
                placeholder={["Od", "Do"]}
                format="YYYY-MM-DD"
                value={
                  filterState.registrationDate
                    ? [
                        dayjs(filterState.registrationDate.from),
                        dayjs(filterState.registrationDate.to),
                      ]
                    : undefined
                }
                onChange={(dates) => {
                  if (dates) {
                    handleInputChange("registrationDate", {
                      from: dates[0]?.format("YYYY-MM-DD"),
                      to: dates[1]?.format("YYYY-MM-DD"),
                    });
                  } else {
                    handleInputChange("registrationDate", undefined);
                  }
                }}
                aria-label="Rozmezí data registrace"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: "16px" }}>
          <Space>
            <Button
              className="bg-blue-600"
              type="primary"
              icon={<FilterFilled />}
              htmlType="submit"
              loading={loading}
              aria-label="Filtrovat registrace"
            >
              {loading ? "Filtrovaní..." : "Filtrovat"}
            </Button>
            <Button
              danger
              type="default"
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={loading}
              aria-label="Resetovat filtry"
            >
              Resetovat
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );
};

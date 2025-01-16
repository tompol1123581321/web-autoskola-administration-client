import React, { useCallback, useEffect } from "react";
import {
  Form,
  Input,
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
import { TermFilter } from "autoskola-web-shared-models";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

type Props = {
  filterState: TermFilter;
  updateFilterState: (filterState: TermFilter) => void;
  onSubmit: (filter: TermFilter) => void;
  onReset: () => void;
  loading: boolean; // Indikuje, zda formulář právě odesílá data
  error?: string; // Nepovinná chybová zpráva
};

export const TermsOverviewFilterForm: React.FC<Props> = ({
  filterState,
  updateFilterState,
  onSubmit,
  onReset,
  loading,
  error,
}) => {
  const [form] = Form.useForm();

  /**
   * Zpracovává změny v poli formuláře a aktualizuje stav filtru.
   *
   * @param key - Klíč ve stavu filtru, který se aktualizuje.
   * @param value - Nová hodnota pro daný klíč.
   */
  const handleInputChange = useCallback(
    (key: keyof TermFilter, value: any) => {
      updateFilterState({
        ...filterState,
        [key]: value,
      });
    },
    [filterState, updateFilterState]
  );

  // Synchronizace formulářových hodnot s filterState
  useEffect(() => {
    form.setFieldsValue({
      nameContains: filterState.nameContains,
      created: filterState.created
        ? [dayjs(filterState.created.from), dayjs(filterState.created.to)]
        : [],
      isActive: filterState.isActive,
    });
  }, [filterState, form]);

  // Zpracování odeslání formuláře
  const onFinish = (values: any) => {
    onSubmit({
      nameContains: values.nameContains,
      created: values.created
        ? {
            from: values.created[0].format("YYYY-MM-DD"),
            to: values.created[1].format("YYYY-MM-DD"),
          }
        : undefined,
      isActive: values.isActive,
    });
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
      aria-label="Filtrovat registrace"
    >
      <Form form={form} layout="vertical" size="large" onFinish={onFinish}>
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
            <Form.Item label="Jméno termínu obsahuje" name="nameContains">
              <Input
                placeholder="Jméno termínu obsahuje"
                onChange={(e) =>
                  handleInputChange("nameContains", e.target.value)
                }
                aria-label="Hledat uživatele"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={16} md={8}>
            <Form.Item label="Datum vytvoření (od - do)" name="created">
              <RangePicker
                placeholder={["Od", "Do"]}
                format="YYYY-MM-DD"
                onChange={(dates) => {
                  if (dates) {
                    handleInputChange("created", {
                      from: dates[0]?.format("YYYY-MM-DD"),
                      to: dates[1]?.format("YYYY-MM-DD"),
                    });
                  } else {
                    handleInputChange("created", undefined);
                  }
                }}
                aria-label="Rozmezí data registrace"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24}>
            <Form.Item name="isActive" valuePropName="checked">
              <Checkbox
                onChange={(e) =>
                  handleInputChange(
                    "isActive",
                    e.target.checked ? e.target.checked : undefined
                  )
                }
                aria-label="Filtrovat aktivní termíny"
              >
                Pouze aktivní termíny
              </Checkbox>
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
              onClick={() => {
                form.resetFields();
                onReset();
              }}
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

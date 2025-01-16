import React, { useCallback } from "react";
import {
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

  /**
   * Zpracovává odeslání formuláře.
   *
   * @param e - Událost odeslání formuláře.
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(filterState);
    },
    [filterState, onSubmit]
  );

  /**
   * Zpracovává resetování filtrů.
   */
  const handleReset = useCallback(() => {
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
          <div className="ant-form-item">
            <label className="ant-form-item-label" htmlFor="nameContains">
              Jméno termínu obsahuje
            </label>
            <Input
              id="nameContains"
              placeholder="Jméno termínu obsahuje"
              value={filterState.nameContains}
              onChange={(e) =>
                handleInputChange("nameContains", e.target.value)
              }
              aria-label="Hledat uživatele"
            />
          </div>
        </Col>

        <Col xs={24} sm={16} md={8}>
          <div className="ant-form-item">
            <label className="ant-form-item-label" htmlFor="created">
              Datum vytvoření (od - do)
            </label>
            <RangePicker
              id="created"
              placeholder={["Od", "Do"]}
              format="YYYY-MM-DD"
              value={
                filterState.created
                  ? [
                      dayjs(filterState.created.from),
                      dayjs(filterState.created.to),
                    ]
                  : null
              }
              onChange={(dates) => {
                if (dates && dates.length === 2) {
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
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24}>
          <Checkbox
            checked={filterState.isActive}
            onChange={(e) =>
              handleInputChange("isActive", e.target.checked ? true : false)
            }
            aria-label="Filtrovat aktivní termíny"
          >
            Pouze aktivní termíny
          </Checkbox>
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: "16px" }}>
        <Space>
          <Button
            className="bg-blue-600"
            type="primary"
            icon={<FilterFilled />}
            onClick={handleSubmit}
            loading={loading}
            aria-label="Filtrovat registrace"
          >
            {loading ? "Filtrovaní..." : "Filtrovat"}
          </Button>
          <Button
            danger
            type="default"
            icon={<ClearOutlined />}
            onClick={handleReset}
            disabled={loading}
            aria-label="Resetovat filtry"
          >
            Resetovat
          </Button>
        </Space>
      </Row>
    </Card>
  );
};

// src/components/body/terms-overview/TermDetail/TermDetailForm.tsx
import React from "react";
import { Form, Row, Col, Input, InputNumber, Checkbox, DatePicker } from "antd";
import { Term } from "autoskola-web-shared-models";
import dayjs from "dayjs";

type TermFormData = Term & {
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
};

interface TermDetailFormProps {
  isAddMode: boolean;
  isEditable: boolean;
  formData: TermFormData;
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNumberChange: (value: number | null) => void;
  onCheckboxChange: (checked: boolean) => void;
  onDateChange: (field: "startDate" | "endDate", value: Date | null) => void;
}

/**
 * Renders the form fields for Term detail.
 */
export const TermDetailForm: React.FC<TermDetailFormProps> = ({
  isAddMode,
  isEditable,
  formData,
  onLabelChange,
  onNumberChange,
  onCheckboxChange,
  onDateChange,
}) => {
  return (
    <Form layout="vertical">
      {/* ID and Created date - only in Edit mode */}
      {!isAddMode && (
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="ID">
              <Input
                value={formData.id}
                disabled
                className="bg-gray-100 cursor-not-allowed"
                placeholder="ID termínu"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Vytvořeno">
              <Input
                value={dayjs(formData.created).format("DD.MM.YYYY HH:mm")}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* Název termínu & maxRegistrationsCount */}
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label="Název termínu"
            rules={[{ required: true, message: "Název termínu je povinný." }]}
          >
            <Input
              name="label"
              value={formData.label}
              onChange={onLabelChange}
              disabled={!isEditable && !isAddMode}
              className={`border ${
                isEditable || isAddMode
                  ? "border-gray-300"
                  : "border-gray-100 cursor-not-allowed"
              } rounded-md`}
              placeholder="Zadejte název termínu"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Maximální počet registrací"
            rules={[
              {
                required: true,
                message: "Maximální počet registrací je povinný.",
              },
              { type: "number", min: 1, message: "Musí být alespoň 1." },
            ]}
          >
            <InputNumber
              min={1}
              value={formData.termConfig.maxRegistrationsCount}
              onChange={onNumberChange}
              disabled={!isEditable && !isAddMode}
              className={`border ${
                isEditable || isAddMode
                  ? "border-gray-300"
                  : "border-gray-100 cursor-not-allowed"
              } rounded-md w-full`}
              placeholder="Zadejte maximální počet registrací"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="Začátek termínu" required>
            <DatePicker
              className="w-full"
              value={formData.startDate ? dayjs(formData.startDate) : null}
              onChange={(date) => onDateChange("startDate", date ? date.toDate() : null)}
              disabled={!isEditable && !isAddMode}
              format="DD.MM.YYYY"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Konec termínu" required>
            <DatePicker
              className="w-full"
              value={formData.endDate ? dayjs(formData.endDate) : null}
              onChange={(date) => onDateChange("endDate", date ? date.toDate() : null)}
              disabled={!isEditable && !isAddMode}
              format="DD.MM.YYYY"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Popis">
        <Input.TextArea
          name="description"
          value={formData.description || ""}
          onChange={onLabelChange}
          disabled={!isEditable && !isAddMode}
          rows={3}
        />
      </Form.Item>

      {/* Aktivní checkbox */}
      <Row>
        <Col span={12}>
          <Form.Item label="Aktivní">
            <Checkbox
              checked={formData.isActive}
              onChange={(e) => onCheckboxChange(e.target.checked)}
              disabled={!isEditable && !isAddMode}
            >
              Aktivní
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

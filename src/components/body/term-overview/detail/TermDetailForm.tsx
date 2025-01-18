// src/components/body/terms-overview/TermDetail/TermDetailForm.tsx
import React from "react";
import { Form, Row, Col, Input, InputNumber, Checkbox } from "antd";
import { Term } from "autoskola-web-shared-models";
import moment from "moment";

interface TermDetailFormProps {
  isAddMode: boolean;
  isEditable: boolean;
  formData: Term;
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (value: number | null) => void;
  onCheckboxChange: (checked: boolean) => void;
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
                value={moment(formData.created).format("YYYY-MM-DD HH:mm")}
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

import React from "react";
import { Checkbox, DatePicker, Select, Input, Form, Row, Col } from "antd";
import { RegistrationFormData, TermOption } from "autoskola-web-shared-models";
import moment from "moment";

const { TextArea } = Input;
const { Option } = Select;

interface RegistrationDetailFormProps {
  formData: RegistrationFormData;
  termOptions: TermOption[];
  isAddMode: boolean;
  isEditable: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onTermChange: (value: string) => void;
  onDateChange: (date: moment.Moment | null) => void;
  onEditToggle: (checked: boolean) => void;
}

export const RegistrationDetailForm: React.FC<RegistrationDetailFormProps> = ({
  formData,
  termOptions,
  isAddMode,
  isEditable,
  onChange,
  onTermChange,
  onDateChange,
  onEditToggle,
}) => {
  return (
    <>
      {/* Edit Toggle (hidden in Add mode) */}
      {!isAddMode && (
        <Row justify="end" style={{ marginBottom: "1rem" }}>
          <Form.Item label="Upravit" colon={false}>
            <Checkbox
              checked={isEditable}
              onChange={(e) => onEditToggle(e.target.checked)}
              aria-label="Přepnout do režimu editace"
            />
          </Form.Item>
        </Row>
      )}

      <Form layout="vertical">
        {/* ID Registrace (only for Edit mode) */}
        {!isAddMode && (
          <Form.Item label="ID" colon={false}>
            <Input
              name="id"
              value={formData.id}
              disabled
              placeholder="ID registrace"
            />
          </Form.Item>
        )}

        {/* Jméno & Příjmení */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Jméno"
              required
              tooltip="Povinné pole"
              colon={false}
            >
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                disabled={!isEditable && !isAddMode}
                placeholder="Zadejte jméno"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Příjmení"
              required
              tooltip="Povinné pole"
              colon={false}
            >
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                disabled={!isEditable && !isAddMode}
                placeholder="Zadejte příjmení"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Telefonní Číslo & Email */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Telefonní číslo"
              required
              tooltip="Povinné pole"
              colon={false}
            >
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
                disabled={!isEditable && !isAddMode}
                placeholder="Zadejte telefonní číslo"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              required
              tooltip="Povinné pole"
              colon={false}
            >
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                disabled={!isEditable && !isAddMode}
                placeholder="Zadejte email"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Termín & Datum Registrace */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Termín"
              required
              tooltip="Povinné pole"
              colon={false}
            >
              <Select
                id="termId"
                value={formData.termId}
                onChange={onTermChange}
                disabled={!isEditable && !isAddMode}
                placeholder="Vyberte termín"
              >
                {termOptions.map((term) => (
                  <Option key={term.id} value={term.id}>
                    {term.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Datum registrace"
              required
              tooltip="Povinné pole"
              colon={false}
            >
              <DatePicker
                id="registrationDate"
                name="registrationDate"
                value={moment(formData.registrationDate)}
                onChange={onDateChange}
                format="YYYY-MM-DD"
                disabled={!isEditable && !isAddMode}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Poznámky */}
        <Form.Item label="Poznámky" colon={false}>
          <TextArea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={onChange}
            disabled={!isEditable && !isAddMode}
            placeholder="Zadejte poznámky"
          />
        </Form.Item>
      </Form>
    </>
  );
};

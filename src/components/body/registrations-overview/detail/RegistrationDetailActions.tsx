import React from "react";
import { Button, Popconfirm, Row, Space } from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";

interface RegistrationDetailActionsProps {
  isAddMode: boolean;
  isEditable: boolean;
  isChanged: boolean;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export const RegistrationDetailActions: React.FC<
  RegistrationDetailActionsProps
> = ({ isAddMode, isEditable, isChanged, onSave, onDelete, onBack }) => {
  return (
    <Row justify="space-between" style={{ marginTop: 24 }}>
      <Button onClick={onBack}>Zpět</Button>

      {(isEditable || isAddMode) && (
        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSave}
            disabled={!isChanged && !isAddMode}
          >
            Uložit
          </Button>
          {!isAddMode && (
            <Popconfirm
              title="Opravdu chcete smazat tuto registraci?"
              onConfirm={onDelete}
              okText="Ano"
              cancelText="Ne"
            >
              <Button danger icon={<DeleteOutlined />}>
                Smazat
              </Button>
            </Popconfirm>
          )}
        </Space>
      )}
    </Row>
  );
};

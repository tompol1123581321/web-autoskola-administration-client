// src/components/body/terms-overview/TermDetail/TermDetailActions.tsx
import React from "react";
import { Button } from "antd";

interface TermDetailActionsProps {
  isAddMode: boolean;
  isEditable: boolean;
  isChanged: boolean;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;
}

/**
 * Renders the action buttons (Back, Save, Delete).
 */
export const TermDetailActions: React.FC<TermDetailActionsProps> = ({
  isAddMode,
  isEditable,
  isChanged,
  onSave,
  onDelete,
  onBack,
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button type="dashed" onClick={onBack}>
        Zpět
      </Button>

      {(isEditable || isAddMode) && (
        <div className="flex space-x-4">
          <Button
            type="dashed"
            onClick={onSave}
            disabled={!isChanged && !isAddMode}
            className={`${
              isChanged || isAddMode
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            } text-white`}
          >
            Uložit
          </Button>
          {!isAddMode && (
            <Button danger onClick={onDelete}>
              Smazat
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

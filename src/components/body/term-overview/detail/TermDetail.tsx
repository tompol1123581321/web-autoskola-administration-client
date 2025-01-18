// src/components/body/terms-overview/TermDetail/TermDetail.tsx
import React from "react";
import { Spin, Alert, Checkbox } from "antd";
import { TermDetailForm } from "./TermDetailForm";
import { TermDetailActions } from "./TermDetailActions";
import { useTermDetail } from "./useTermDetail";

/**
 * Main component for Term Detail. It just glues everything together:
 * - uses the hook for logic
 * - uses smaller components to render the UI
 */
export const TermDetail: React.FC = () => {
  const {
    isAddMode,
    formData,
    isChanged,
    isEditable,
    loading,
    error,
    handleChange,
    handleNumberChange,
    handleCheckboxChange,
    handleEditToggle,
    handleSave,
    handleDelete,
    handleBack,
  } = useTermDetail();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin
          tip={isAddMode ? "Vytváření termínu..." : "Načítání termínu..."}
          size="large"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          message="Chyba"
          description={error}
          type="error"
          showIcon
          className="w-1/2"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-10 bg-gray-100 min-h-screen p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isAddMode ? "Přidat nový termín" : "Detaily termínu"}
        </h2>

        {/* Edit toggle (not visible in Add mode) */}
        {!isAddMode && (
          <div className="flex justify-end mb-4">
            <Checkbox
              checked={isEditable}
              onChange={(e) => handleEditToggle(e.target.checked)}
              className="text-sm"
            >
              Upravit
            </Checkbox>
          </div>
        )}

        {/* Form fields */}
        <TermDetailForm
          isAddMode={isAddMode}
          isEditable={isEditable}
          formData={formData}
          onLabelChange={handleChange}
          onNumberChange={handleNumberChange}
          onCheckboxChange={handleCheckboxChange}
        />

        {/* Actions (Save, Delete, Back) */}
        <TermDetailActions
          isAddMode={isAddMode}
          isEditable={isEditable}
          isChanged={isChanged}
          onSave={handleSave}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

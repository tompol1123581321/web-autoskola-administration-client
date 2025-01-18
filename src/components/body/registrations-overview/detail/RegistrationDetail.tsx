// src/components/body/registrations-overview/RegistrationDetail/RegistrationDetail.tsx
import React from "react";
import { Spin, Alert } from "antd";
import { useRegistrationDetail } from "./useRegistrationDetail";
import { RegistrationDetailForm } from "./RegistrationDetailForm";
import { RegistrationDetailActions } from "./RegistrationDetailActions";

export const RegistrationDetail: React.FC = () => {
  const {
    // State
    formData,
    termOptions,
    isLoading,
    error,
    isChanged,
    isEditable,
    isAddMode,

    // Handlers
    handleChange,
    handleTermChange,
    handleDateChange,
    handleEditToggle,
    handleSave,
    handleDelete,
    handleBack,
  } = useRegistrationDetail();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Načítání registrace..." size="large" />
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
          {isAddMode ? "Přidat novou registraci" : "Detail registrace"}
        </h2>

        {/* Render the form */}
        <RegistrationDetailForm
          formData={formData}
          termOptions={termOptions}
          isAddMode={isAddMode}
          isEditable={isEditable}
          onChange={handleChange}
          onTermChange={handleTermChange}
          onDateChange={handleDateChange}
          onEditToggle={handleEditToggle}
        />

        {/* Action buttons */}
        <RegistrationDetailActions
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

export default RegistrationDetail;

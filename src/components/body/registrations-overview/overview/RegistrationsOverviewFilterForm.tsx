// components/body/registrations-overview/RegistrationsOverviewFilterForm.tsx

import React, { useCallback } from "react";
import { Input, Select, DatePicker, Button, Checkbox, Alert } from "antd";
import { ClearOutlined, FilterFilled } from "@ant-design/icons";
import { RegistrationsFilter } from "autoskola-web-shared-models";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

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
  termsOptions: TermOption[]; // Array of terms for the Select component
  loading: boolean; // Indicates if the form is submitting data
  error?: string; // Optional error message
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
   * Handles input changes and updates the filter state.
   *
   * @param key - The key in the filter state to update.
   * @param value - The new value for the specified key.
   */
  const handleInputChange = useCallback(
    (key: keyof RegistrationsFilter["dataFilterParams"], value: any) => {
      console.log(key, value);
      updateFilterState({
        ...filterState,
        [key]: value,
      });
    },
    [filterState, updateFilterState]
  );
  /**
   * Handles form submission.
   *
   * @param e - The form event.
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  /**
   * Handles form reset.
   */
  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      aria-label="Filtrovat registrace"
    >
      {error && (
        <div className="mb-4">
          <Alert
            message="Chyba"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => {}}
          />
        </div>
      )}

      <form
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* User Search Input */}
          <div className="flex flex-col">
            <label
              htmlFor="userSearch"
              className="mb-2 font-semibold text-gray-700"
            >
              Hledat uživatele
            </label>
            <Input
              id="userSearch"
              placeholder="Hledat podle jména, emailu atd."
              allowClear
              value={filterState.userSearch}
              onChange={(e) => handleInputChange("userSearch", e.target.value)}
              aria-label="Hledat uživatele"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Term Selection */}
          <div className="flex flex-col">
            <label
              htmlFor="termId"
              className="mb-2 font-semibold text-gray-700"
            >
              Vybrat termín
            </label>
            <Select
              id="termId"
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
              className="h-10"
            >
              {termsOptions.map((term) => (
                <Option key={term.termId} value={term.termId}>
                  {term.termName}
                </Option>
              ))}
            </Select>
          </div>

          {/* Registration Date Range */}
          <div className="flex flex-col">
            <label
              htmlFor="registrationDate"
              className="mb-2 font-semibold text-gray-700"
            >
              Datum registrace (od - do)
            </label>
            <RangePicker
              id="registrationDate"
              placeholder={["Od", "Do"]}
              format="YYYY-MM-DD"
              value={
                filterState.registrationDate
                  ? [
                      dayjs(filterState.registrationDate.from),
                      dayjs(filterState.registrationDate.to),
                    ]
                  : null
              }
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  handleInputChange("registrationDate", {
                    from: dates[0]?.format("YYYY-MM-DD"),
                    to: dates[1]?.format("YYYY-MM-DD"),
                  });
                } else {
                  handleInputChange("registrationDate", undefined);
                }
              }}
              aria-label="Rozmezí data registrace"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Active Terms Checkbox */}
        <div className="mt-4 flex items-center">
          <Checkbox
            checked={filterState.activeTerms ?? true}
            onChange={(e) =>
              handleInputChange(
                "activeTerms",
                e.target.checked ? true : undefined
              )
            }
            aria-label="Filtrovat aktivní termíny"
            className="text-gray-700"
          >
            Pouze aktivní termíny
          </Checkbox>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            className="bg-blue-600 hover:bg-blue-400"
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
            type="primary"
            icon={<ClearOutlined />}
            onClick={handleReset}
            disabled={loading}
            aria-label="Resetovat filtry"
          >
            Resetovat
          </Button>
        </div>
      </form>
    </div>
  );
};

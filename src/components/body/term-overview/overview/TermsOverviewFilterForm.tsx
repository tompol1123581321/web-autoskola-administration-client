import React, { useCallback } from "react";
import { Input, DatePicker, Button, Checkbox, Alert } from "antd";
import { ClearOutlined, FilterFilled } from "@ant-design/icons";
import { TermFilter } from "autoskola-web-shared-models";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

type Props = {
  filterState: TermFilter;
  updateFilterState: (filterState: TermFilter) => void;
  onSubmit: (filter: TermFilter) => void;
  onReset: () => void;
  loading: boolean; // Indicates if the form is submitting data
  error?: string; // Optional error message
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
   * Handles form field changes and updates the filter state.
   *
   * @param key - The key in the filter state to update.
   * @param value - The new value for the specified key.
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
   * Handles form submission.
   *
   * @param e - Form submission event.
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(filterState);
    },
    [filterState, onSubmit]
  );

  /**
   * Handles resetting the filters.
   */
  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <div
      className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md"
      aria-label="Filtrovat registrace"
    >
      {/* Display error message if exists */}
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Name Contains */}
          <div className="flex flex-col">
            <label
              htmlFor="nameContains"
              className="mb-2 font-semibold text-gray-700"
            >
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
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Created Date Range */}
          <div className="flex flex-col">
            <label
              htmlFor="created"
              className="mb-2 font-semibold text-gray-700"
            >
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
              className="rounded-md"
            />
          </div>
        </div>

        {/* Active Checkbox */}
        <div className="mt-4 flex items-center">
          <Checkbox
            checked={filterState.isActive}
            onChange={(e) =>
              handleInputChange("isActive", e.target.checked ? true : false)
            }
            aria-label="Filtrovat aktivní termíny"
            className="text-gray-700"
          >
            Pouze aktivní termíny
          </Checkbox>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            type="primary"
            icon={<FilterFilled />}
            htmlType="submit"
            loading={loading}
            aria-label="Filtrovat registrace"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center"
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
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md flex items-center"
          >
            Resetovat
          </Button>
        </div>
      </form>
    </div>
  );
};

// components/body/registrations-overview/RegistrationsOverviewTable.tsx

import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  RegistrationFormData,
  RegistrationsPaginationParams,
} from "autoskola-web-shared-models";
import { useNavigate } from "react-router-dom";

// Definice sloupců tabulky s přeloženými popisky a Tailwind CSS třídami
const columns: ColumnsType<RegistrationFormData> = [
  {
    title: "ID", // ID
    dataIndex: "id", // Klíč pro data
    key: "id", // Unikátní klíč
    width: 50, // Šířka sloupce
    className: "text-center",
  },
  {
    title: "Jméno", // First Name
    dataIndex: "firstName",
    key: "firstName",
    className: "font-medium",
  },
  {
    title: "Příjmení", // Last Name
    dataIndex: "lastName",
    key: "lastName",
    className: "font-medium",
  },
  {
    title: "Telefonní číslo", // Phone Number
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width: 150,
    className: "text-center",
  },
  {
    title: "Email", // Email
    dataIndex: "email",
    key: "email",
    width: 200,
    className: "text-center",
  },
  {
    title: "Poznámky", // Notes
    dataIndex: "notes",
    key: "notes",
    width: 250,
    render: (text: string) => (
      <span>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
    ), // Zkrácení dlouhých poznámek
    className: "text-left",
  },
  {
    title: "Termín", // Term
    dataIndex: "termId",
    key: "termId",
    filters: [
      { text: "Březen", value: "Březen" },
      { text: "Červen", value: "Červen" },
      { text: "Září", value: "Září" },
      { text: "Prosinec", value: "Prosinec" },
    ],
    onFilter: (value, record) => record.termId === value,
    render: (termId: string) => termId, // Zobrazení názvu termínu
    className: "text-center",
  },
];

type TableProps = {
  data?: Array<RegistrationFormData>;
  isLoading?: boolean;
  updatePagination: (pagination: RegistrationsPaginationParams) => void;
  paginationState: RegistrationsPaginationParams;
};

export const RegistrationsOverviewTable: React.FC<TableProps> = ({
  data,
  isLoading,
  updatePagination,
  paginationState,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table<RegistrationFormData>
        bordered
        loading={isLoading}
        columns={columns}
        dataSource={data}
        onChange={({ pageSize = 10, current }) => {
          updatePagination({ page: current ?? 1, pageSize });
        }}
        pagination={{
          pageSize: paginationState.pageSize,
          position: ["bottomCenter"],
          showSizeChanger: false,
          current: paginationState.page,
        }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/app/registration-detail/${record.id}`); // Přechod na detailní stránku
          },
        })}
        rowClassName={() =>
          "cursor-pointer hover:bg-blue-50 transition-colors duration-200"
        } // Přidání Tailwind tříd pro styly
        scroll={{ x: true }}
      />
    </div>
  );
};

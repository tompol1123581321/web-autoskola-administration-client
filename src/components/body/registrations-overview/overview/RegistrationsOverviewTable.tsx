// components/body/registrations-overview/RegistrationsOverviewTable.tsx

import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { RegistrationSearchParams } from "../../../../services/useRegistrationsService";
import { AdminRegistration } from "../../../../services/useRegistrationsService";
import { formatDateTime } from "../../../../utils/dateUtils";

// Definice sloupců tabulky s přeloženými popisky a Tailwind CSS třídami
const columns: ColumnsType<AdminRegistration> = [
  {
    title: "Jméno", // First Name
    dataIndex: "firstName",
    key: "firstName",
    className: "font-medium",
    width: 100, // Šířka sloupce
  },
  {
    title: "Příjmení", // Last Name
    dataIndex: "lastName",
    key: "lastName",
    className: "font-medium",
    width: 100, // Šířka sloupce
  },
  {
    title: "Telefonní číslo", // Phone Number
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width: 100,
    className: "text-center",
  },
  {
    title: "Email", // Email
    dataIndex: "email",
    key: "email",
    width: 100,
    className: "text-center",
  },
  {
    title: "Termín", // Term
    dataIndex: "termId",
    key: "termId",
    width: 100,
    onFilter: (value, record) => record.termId === value,
    className: "text-center",
  },
  {
    title: "Datum registrace",
    dataIndex: "registrationDate",
    key: "registrationDate",
    width: 150,
    render: (value: string | Date) => formatDateTime(value),
  },
  {
    title: "Poznámky",
    dataIndex: "notes",
    key: "notes",
    width: 180,
    ellipsis: true,
    render: (text: string | undefined) => text ? <span>{text.length > 40 ? `${text.substring(0, 40)}...` : text}</span> : "-",
  },
  {
    title: "Interní poznámka",
    dataIndex: "adminNote",
    key: "adminNote",
    width: 180,
    ellipsis: true,
    render: (text: string | undefined) => text ? <span>{text.length > 40 ? `${text.substring(0, 40)}...` : text}</span> : "-",
  },
];

type TableProps = {
  data?: Array<AdminRegistration>;
  isLoading?: boolean;
  updatePagination: (pagination: RegistrationSearchParams["paginationsParams"]) => void;
  paginationState: RegistrationSearchParams["paginationsParams"];
  total: number;
};

export const RegistrationsOverviewTable: React.FC<TableProps> = ({
  data,
  isLoading,
  updatePagination,
  paginationState,
  total,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table<AdminRegistration>
        bordered
        loading={isLoading}
        columns={columns}
        dataSource={data ?? []}
        tableLayout="fixed"
        locale={{ emptyText: "Pro zadané filtry nebyly nalezeny žádné registrace." }}
        onChange={({ pageSize = 20, current }) => {
          updatePagination({ page: current ?? 1, pageSize });
        }}
        pagination={{
          pageSize: paginationState.pageSize,
          position: ["bottomCenter"],
          showSizeChanger: true,
          showQuickJumper: { goButton: "Přejít" },
          pageSizeOptions: [10, 20, 50, 100],
          current: paginationState.page,
          total,
          showTotal: (count) => `Celkem ${count} registrací`,
        }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/app/registration-detail/${record.id}/${record.termId}`); // Přechod na detailní stránku
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

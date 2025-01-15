// components/body/registrations-overview/RegistrationsOverviewTable.tsx

import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Term } from "autoskola-web-shared-models";
import { useNavigate } from "react-router-dom";

// Definice sloupců tabulky s přeloženými popisky a Tailwind CSS třídami
const columns: ColumnsType<Term> = [
  {
    title: "ID", // ID
    dataIndex: "id", // Klíč pro data
    key: "id", // Unikátní klíč
    width: 50, // Šířka sloupce
    className: "text-center",
  },
  {
    title: "Název", // First Name
    dataIndex: "label",
    key: "label",
    className: "font-medium",
  },

  {
    title: "Aktivní", // Phone Number
    dataIndex: "isActive",
    key: "isActive",
    width: 150,
    className: "text-center",
  },
];

type TableProps = {
  data?: Array<Term>;
  isLoading?: boolean;
};

export const TermsOverviewTable: React.FC<TableProps> = ({
  data,
  isLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table<Term>
        bordered
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
          showSizeChanger: false,
        }}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/app/term-detail/${record.id}`); // Přechod na detailní stránku
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

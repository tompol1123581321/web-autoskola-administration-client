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
    width: 200, // Šířka sloupce
    className: "text-center",
  },
  {
    title: "Název", // First Name
    dataIndex: "label",
    key: "label",
    width: 100,
    className: "font-medium",
  },

  {
    title: "Aktivní", // Phone Number
    dataIndex: "isActive",
    key: "isActive",
    render(value, record, index) {
      return value ? "Aktivní" : "Neaktivní";
    },
    width: 100,
    className: "text-center",
  },
  {
    title: "Maximální počet registrací", // Phone Number
    dataIndex: "termConfig",

    render(value, record, index) {
      return record.termConfig.maxRegistrationsCount;
    },
    key: "termConfig",
    width: 100,
    className: "text-center",
  },
  {
    title: "Aktuální počet registrací", // Phone Number
    dataIndex: "registrations",

    render(value) {
      return value.length;
    },
    key: "registrations",
    width: 100,
    className: "text-center",
  },
];

const TEST_DATA: Array<Term> = [
  {
    created: new Date(Date.now()),
    id: "asdasdasd-asdasdasda-asdasdasdas-asdasd",
    isActive: true,
    label: "label 201203",
    registrations: [],
    termConfig: { maxRegistrationsCount: 20 },
  },
];

type TableProps = {
  data?: Array<Term>;
  isLoading?: boolean;
};

export const TermsOverviewTable: React.FC<TableProps> = ({
  data = TEST_DATA,
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
            navigate(`/app/terms/term-detail/${record.id}`); // Přechod na detailní stránku
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

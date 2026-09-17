// components/body/registrations-overview/RegistrationsOverviewTable.tsx

import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Term } from "autoskola-web-shared-models";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../../../utils/dateUtils";

// Definice sloupců tabulky s přeloženými popisky a Tailwind CSS třídami
const columns: ColumnsType<Term> = [
  {
    title: "Datum vytvoření", // ID
    dataIndex: "created", // Klíč pro data
    key: "created", // Unikátní klíč
    render: (value: string | Date) => formatDateTime(value),
    width: 100, // Šířka sloupce
  },
  {
    title: "Název", // First Name
    dataIndex: "label",
    key: "label",
    width: 100,
  },

  {
    title: "Aktivní", // Phone Number
    dataIndex: "isActive",
    key: "isActive",
    render(value) {
      return value ? "Aktivní" : "Neaktivní";
    },
    width: 100,
  },
  {
    title: "Maximální počet registrací", // Phone Number
    dataIndex: "termConfig",

    render(_, record) {
      return record.termConfig.maxRegistrationsCount;
    },
    key: "termConfig",
    width: 100,
  },
  {
    title: "Aktuální počet registrací", // Phone Number
    dataIndex: "registeredCount",

    render(value) {
      return value?.length ?? 0;
    },
    key: "registeredCount",
    width: 100,
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
          showQuickJumper: { goButton: "Přejít" },
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

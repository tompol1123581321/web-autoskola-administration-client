// components/body/registrations-overview/RegistrationsOverviewTable.tsx

import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { RegistrationFormData } from "autoskola-web-shared-models";
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

// Sample data pro generování smysluplných hodnot (přeloženo do češtiny)
const firstNames = [
  "Jan",
  "Jana",
  "Alice",
  "Bob",
  "Karel",
  "Diana",
  "Edward",
  "Fiona",
];
const lastNames = [
  "Novák",
  "Doe",
  "Johnson",
  "Williams",
  "Brown",
  "Taylor",
  "Anderson",
  "Lee",
];
const emails = [
  "jan.novak@example.com",
  "jana.doe@example.com",
  "alice.j@example.com",
  "bob.w@example.com",
  "karel.b@example.com",
  "diana.t@example.com",
  "edward.a@example.com",
  "fiona.l@example.com",
];
const phoneNumbers = [
  "555-1234",
  "555-5678",
  "555-8765",
  "555-4321",
  "555-1122",
  "555-3344",
  "555-5566",
  "555-7788",
];
const notesArray = [
  "Potřebuje extra pomoc",
  "Preferuje ranní kurzy",
  "Má předchozí zkušenosti",
  "Nový student",
  "Bude potřebovat speciální ubytování",
  "Bydlí daleko od školy",
  "Chce víkendové kurzy",
  "Zajímá se o pokročilé školení",
];

// Přeložené termíny
const terms = ["Březen", "Červen", "Září", "Prosinec"];

// Pomocná funkce pro získání náhodného prvku z pole
const getRandomElement = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Generování ukázkových dat
const dataSource = Array.from({ length: 100 }).map<RegistrationFormData>(
  (_, i) => {
    const selectedTerm = getRandomElement(terms);

    return {
      registrationDate: new Date(Date.now()),
      id: i.toString(),
      firstName: getRandomElement(firstNames),
      lastName: getRandomElement(lastNames),
      phoneNumber: getRandomElement(phoneNumbers),
      email: getRandomElement(emails),
      notes: getRandomElement(notesArray),
      termId: selectedTerm,
      type: getRandomElement(["A", "B", "Kombinace"]), // Typ vozidla
    };
  }
);

type TableProps = {
  data?: Array<RegistrationFormData>;
  isLoading?: boolean;
};

export const TermsOverviewTable: React.FC<TableProps> = ({
  data = dataSource,
  isLoading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table<RegistrationFormData>
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

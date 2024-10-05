import React from "react";
import { Table } from "antd";
// import { createStyles } from "antd-style";
import {
  RegistrationFormData,
  TermTime,
  VehicleType,
} from "autoskola-web-shared-models";
import { ColumnsType } from "antd/es/table";

// const useStyle = createStyles(({ css, token }) => {
//   const { antCls } = token;
//   return {
//     customTable: css`
//       ${antCls}-table {
//         ${antCls}-table-container {
//           ${antCls}-table-body,
//           ${antCls}-table-content {
//             scrollbar-width: thin;
//             scrollbar-color: unset;
//           }
//         }
//       }
//     `,
//   };
// });

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<RegistrationFormData> = [
  {
    title: "ID", // The label of the column
    dataIndex: "id", // The key that matches the data field
    key: "id", // A unique key for this column
    width: 50, // Optional: width setting for the column
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width: 150,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 200,
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
    width: 250,
    render: (text: string) => (
      <span>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
    ), // Truncate long notes
  },
  {
    title: "Vehicle Type",
    dataIndex: "type",
    key: "type",
    filters: [
      { text: "A", value: "A" },
      { text: "B", value: "B" },
      { text: "Combination", value: "Combination" },
    ],
  },
  {
    title: "Course Version",
    dataIndex: "courseVersion",
    key: "courseVersion",
  },
  {
    title: "Term",
    dataIndex: "termId",
    key: "termId",
    filters: [
      { text: "March", value: "March" },
      { text: "June", value: "June" },
      { text: "September", value: "September" },
      { text: "December", value: "December" },
    ],
  },
];

// Sample data for generating sensible values
const firstNames = [
  "John",
  "Jane",
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Edward",
  "Fiona",
];
const lastNames = [
  "Smith",
  "Doe",
  "Johnson",
  "Williams",
  "Brown",
  "Taylor",
  "Anderson",
  "Lee",
];
const emails = [
  "john.smith@example.com",
  "jane.doe@example.com",
  "alice.j@example.com",
  "bob.w@example.com",
  "charlie.b@example.com",
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
  "Needs extra help",
  "Prefers morning classes",
  "Has prior experience",
  "New student",
  "Will require special accommodations",
  "Lives far from the school",
  "Wants weekend classes",
  "Interested in advanced training",
];

const vehicleTypes: VehicleType[] = ["A", "B", "Combination"];
const terms: TermTime[] = ["March", "June", "September", "December"];
const courseVersions = [
  { label: "Basic Course", value: 101 },
  { label: "Advanced Course", value: 102 },
  { label: "Expert Course", value: 103 },
];

// Helper function to get a random element from an array
const getRandomElement = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const dataSource = Array.from({ length: 100 }).map<RegistrationFormData>(
  (_, i) => {
    const type = getRandomElement(vehicleTypes);
    const selectedTerm = getRandomElement(terms);
    const selectedCourseVersion = getRandomElement(courseVersions);

    return {
      id: i,
      firstName: getRandomElement(firstNames),
      lastName: getRandomElement(lastNames),
      phoneNumber: getRandomElement(phoneNumbers),
      email: getRandomElement(emails),
      notes: getRandomElement(notesArray),
      term: i,
      type,
      courseVersion: selectedCourseVersion.label,
      termId: selectedTerm,
    };
  }
);

type Props = {
  data?: Array<RegistrationFormData>;
  isLoading?: boolean;
};

export const RegistrationsOverviewTable: React.FC<Props> = ({
  data = dataSource,
  isLoading,
}) => {
  //   const { styles } = useStyle();

  return (
    <Table<RegistrationFormData>
      bordered
      loading={isLoading}
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10, position: ["bottomCenter"] }}
      onChange={console.log}
      scroll={{ x: true }}
    />
  );
};

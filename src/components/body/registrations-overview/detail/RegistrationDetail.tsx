// components/body/registrations-overview/RegistrationDetail.tsx

import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  message,
  Form,
  Row,
  Col,
  Checkbox,
  Spin,
  Alert,
  Select,
} from "antd";
import { RegistrationFormData } from "autoskola-web-shared-models";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { CheckboxChangeEvent } from "antd/es/checkbox";

const { TextArea } = Input;
const { Option } = Select;

// Mock data for active terms
const activeTerms = ["Březen", "Červen", "Září", "Prosinec"];

export const RegistrationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Rozlišení režimu: přidání nové registrace vs. úprava existující
  const isAddMode = id === "add";

  const onDelete = (id: string) => {
    console.log("Delete registration with ID:", id);
    message.success("Registrace byla úspěšně smazána.");
    navigate("/registrations"); // Po smazání se vrátí na přehled registrací
  };

  const onSave = (updatedData: RegistrationFormData) => {
    if (isAddMode) {
      // Logika pro vytvoření nové registrace
      console.log("Create new registration data:", updatedData);
      message.success("Nová registrace byla úspěšně vytvořena.");
      // Implementuj logiku pro vytvoření registrace v backendu
    } else {
      // Logika pro aktualizaci existující registrace
      console.log("Update registration data:", updatedData);
      message.success("Registrace byla úspěšně aktualizována.");
      // Implementuj logiku pro aktualizaci registrace v backendu
    }
  };

  const onBack = () => {
    navigate("/app");
  };

  // Předpokládaná data získaná z backendu (pro editaci)
  const initialData: RegistrationFormData = {
    email: "jan.novak@example.com",
    firstName: "Jan",
    id: "123", // Předpokládáme, že ID je string. Pokud je číslo, uprav typ v RegistrationFormData
    lastName: "Novák",
    notes: "Potřebuje extra pomoc",
    phoneNumber: "555-1234",
    registrationDate: new Date(),
    termId: "Březen",
  };

  // Local state for form values
  const [formData, setFormData] = useState<RegistrationFormData>(
    isAddMode
      ? {
          email: "",
          firstName: "",
          id: "", // Při přidávání může být ID prázdné nebo generované backendem
          lastName: "",
          notes: "",
          phoneNumber: "",
          registrationDate: new Date(),
          termId: "",
        }
      : {
          ...initialData,
          registrationDate: moment(initialData.registrationDate).toDate(), // Initialize date with moment
        }
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isEditable, setIsEditable] = useState(isAddMode); // Při přidávání je formulář editovatelný od začátku
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Effect to fetch data from backend (simulace)
  useEffect(() => {
    const fetchData = async () => {
      if (!isAddMode && id) {
        setLoading(true);
        try {
          // Simulace načítání dat
          // Nahraď tuto část skutečným API voláním
          // Např. const data = await getRegistrationById(id);
          // setFormData({
          //   ...data,
          //   registrationDate: moment(data.registrationDate).toDate(),
          // });
          // Pro demo účely necháme data jako initialData
        } catch (err: any) {
          setError(err.message || "Nepodařilo se načíst data registrace.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, isAddMode]);

  // Handle form value changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    trackChanges({ ...formData, [name]: value });
  };

  // Handle select change for termId
  const handleTermChange = (value: string) => {
    setFormData((prev) => ({ ...prev, termId: value }));
    trackChanges({ ...formData, termId: value });
  };

  // Handle date change
  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, registrationDate: date.toDate() }));
      trackChanges({ ...formData, registrationDate: date.toDate() });
    } else {
      setFormData((prev) => ({
        ...prev,
        registrationDate: initialData.registrationDate,
      }));
      trackChanges({
        ...formData,
        registrationDate: initialData.registrationDate,
      });
    }
  };

  // Track if any change is made to formData
  const trackChanges = (updatedData: RegistrationFormData) => {
    const hasChanged = Object.keys(updatedData).some(
      (key) =>
        key !== "id" &&
        updatedData[key as keyof RegistrationFormData] !==
          (isAddMode
            ? "" // Při přidávání porovnej s prázdným řetězcem
            : initialData[key as keyof RegistrationFormData])
    );
    setIsChanged(hasChanged);
  };

  // Handle save button click
  const handleSave = () => {
    if (!isChanged && !isAddMode) {
      message.warning("Nebyla detekována žádná změna.");
      return;
    }
    onSave(formData);
    setIsEditable(false);
    setIsChanged(false);
  };

  // Handle delete button click
  const handleDelete = () => {
    onDelete(formData.id);
  };

  // Handle edit checkbox change
  const handleEditToggle = (e: CheckboxChangeEvent) => {
    setIsEditable(e.target.checked);
    if (!e.target.checked) {
      if (isAddMode) {
        setFormData({
          email: "",
          firstName: "",
          id: "add",
          lastName: "",
          notes: "",
          phoneNumber: "",
          registrationDate: new Date(),
          termId: "",
        });
      } else {
        setFormData({
          ...initialData,
          registrationDate: moment(initialData.registrationDate).toDate(),
        });
      }
      setIsChanged(false);
    }
  };

  if (loading) {
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

        {/* Checkbox pro přepínání mezi čtením a editací (skrytý v režimu přidávání) */}
        {!isAddMode && (
          <div className="flex justify-end mb-4">
            <Checkbox
              checked={isEditable}
              onChange={handleEditToggle}
              className="text-sm"
            >
              Upravit
            </Checkbox>
          </div>
        )}

        <Form layout="vertical">
          {/* První řádek */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID">
                <Input
                  value={formData.id}
                  disabled
                  className={`bg-gray-100 cursor-not-allowed ${
                    isAddMode ? "bg-white" : ""
                  }`}
                  placeholder={isAddMode ? "Nová registrace" : ""}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Druhý řádek */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Jméno"
                rules={[{ required: true, message: "Jméno je povinné" }]}
              >
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md`}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Příjmení"
                rules={[{ required: true, message: "Příjmení je povinné" }]}
              >
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md`}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Třetí řádek */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Telefonní číslo"
                rules={[
                  { required: true, message: "Telefonní číslo je povinné" },
                ]}
              >
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md`}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                rules={[
                  { required: true, message: "Email je povinný" },
                  { type: "email", message: "Zadejte platný email" },
                ]}
              >
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md`}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Čtvrtý řádek */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Termín"
                rules={[{ required: true, message: "Termín je povinný" }]}
              >
                <Select
                  value={formData.termId}
                  onChange={handleTermChange}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md w-full`}
                  placeholder="Vyberte termín"
                >
                  {activeTerms.map((term) => (
                    <Option key={term} value={term}>
                      {term}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Datum registrace"
                rules={[
                  { required: true, message: "Datum registrace je povinné" },
                ]}
              >
                <DatePicker
                  value={moment(formData.registrationDate)}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md w-full`}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Pátý řádek */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Poznámky">
                <TextArea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md`}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Tlačítka */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={onBack}
              className="bg-gray-300 hover:bg-gray-400 text-white"
            >
              Zpět
            </Button>
            {(isEditable || isAddMode) && (
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  onClick={handleSave}
                  disabled={!isChanged && !isAddMode}
                  className={`${
                    isChanged || isAddMode
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-blue-300 cursor-not-allowed"
                  } text-white`}
                >
                  Uložit
                </Button>
                {!isAddMode && (
                  <Button
                    danger
                    onClick={handleDelete}
                    className="bg-red-200 hover:bg-red-600 text-white"
                  >
                    Smazat
                  </Button>
                )}
              </div>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegistrationDetail;

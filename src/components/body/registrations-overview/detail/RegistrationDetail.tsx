// src/components/RegistrationDetail.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Input,
  Button,
  DatePicker,
  message,
  Spin,
  Alert,
  Select,
  Popconfirm,
} from "antd";
import { RegistrationFormData, TermOption } from "autoskola-web-shared-models";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { useRegistrationsService } from "../../../../services/useRegistrationsService";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

export const RegistrationDetail: React.FC = () => {
  const {
    createRegistration,
    deleteRegistration,
    updateRegistration,
    getRegistrationById,
    getRegistrationOptions,
  } = useRegistrationsService();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isAddMode = id === "add";

  const [termOptions, setTermOptions] = useState<Array<TermOption>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    firstName: "",
    id: "", // Při přidávání může být ID prázdné nebo generované backendem
    lastName: "",
    notes: "",
    phoneNumber: "",
    registrationDate: new Date(),
    termId: "",
  });
  const [initialData, setInitialData] = useState<RegistrationFormData | null>(
    null
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(isAddMode); // Při přidávání je formulář editovatelný od začátku
  const [error, setError] = useState<string>("");

  // Načtení termínů z backendu
  const loadTermOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const options = await getRegistrationOptions();
      setTermOptions(options);
    } catch (error: any) {
      console.error("Chyba při načítání termínů:", error);
      setError(error.message || "Nepodařilo se načíst termíny.");
    } finally {
      setIsLoading(false);
    }
  }, [getRegistrationOptions]);

  // Načtení detailů registrace (pokud není v režimu přidávání)
  const loadRegistration = useCallback(async () => {
    if (!isAddMode && id) {
      try {
        setIsLoading(true);
        const data = await getRegistrationById(id);
        setFormData({
          ...data,
          registrationDate: moment(data.registrationDate).toDate(),
        });
        setInitialData({
          ...data,
          registrationDate: moment(data.registrationDate).toDate(),
        });
      } catch (error: any) {
        console.error("Chyba při načítání registrace:", error);
        setError(error.message || "Nepodařilo se načíst data registrace.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, isAddMode, getRegistrationById]);

  useEffect(() => {
    loadTermOptions();
    loadRegistration();
  }, [loadTermOptions, loadRegistration]);

  // Zpracování změn ve vstupních polích
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  // Zpracování změny v selectu pro termId
  const handleTermChange = (value: string) => {
    setFormData((prev) => ({ ...prev, termId: value }));
    setIsChanged(true);
  };

  // Zpracování změny data registrace
  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, registrationDate: date.toDate() }));
      setIsChanged(true);
    }
  };

  // Sledování změn pro povolení tlačítka Uložit
  useEffect(() => {
    if (initialData) {
      const hasChanged = Object.keys(formData).some((key) => {
        if (key === "registrationDate") {
          return (
            new Date(
              formData[key as keyof RegistrationFormData] as Date
            ).getTime() !==
            new Date(
              initialData[key as keyof RegistrationFormData] as Date
            ).getTime()
          );
        }
        return (
          formData[key as keyof RegistrationFormData] !==
          initialData[key as keyof RegistrationFormData]
        );
      });
      setIsChanged(hasChanged);
    } else if (isAddMode) {
      const isAnyFieldFilled = Object.values(formData).some(
        (value) => value !== "" && value !== null
      );
      setIsChanged(isAnyFieldFilled);
    }
  }, [formData, initialData, isAddMode]);

  // Ošetření uložení formuláře
  const handleSave = async () => {
    // Validace: zkontrolovat, že všechna povinná pole jsou vyplněna
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.email.trim() ||
      !formData.termId ||
      !formData.registrationDate
    ) {
      message.error("Prosím, vyplňte všechna povinná pole.");
      return;
    }

    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error("Prosím, zadejte platný email.");
      return;
    }

    setIsLoading(true);
    try {
      if (isAddMode) {
        // Vytvoření nové registrace
        const newRegistration = await createRegistration({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          notes: formData.notes,
          termId: formData.termId,
          registrationDate: formData.registrationDate,
        });
        message.success("Nová registrace byla úspěšně vytvořena.");
        navigate(`/registrations/${newRegistration.id}`);
      } else {
        // Aktualizace existující registrace
        const updatedRegistration = await updateRegistration(formData);
        message.success("Registrace byla úspěšně aktualizována.");
        setInitialData({
          ...updatedRegistration,
          registrationDate: moment(
            updatedRegistration.registrationDate
          ).toDate(),
        });
      }
      setIsChanged(false);
    } catch (error: any) {
      console.error("Chyba při ukládání registrace:", error);
      message.error(error.message || "Nepodařilo se uložit registraci.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ošetření smazání registrace
  const handleDelete = async () => {
    if (!isAddMode && formData.id && formData.termId) {
      try {
        setIsLoading(true);
        await deleteRegistration(formData.termId, formData.id);
        message.success("Registrace byla úspěšně smazána.");
        navigate("/registrations"); // Po smazání se vrátí na přehled registrací
      } catch (error: any) {
        console.error("Chyba při mazání registrace:", error);
        message.error(error.message || "Nepodařilo se smazat registraci.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Ošetření tlačítka Zpět
  const handleBack = () => {
    navigate("/registrations");
  };

  // Ošetření přepínače Upravit
  const handleEditToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setIsEditable(checked);
    if (!checked && initialData) {
      setFormData(initialData);
      setIsChanged(false);
    }
  };

  if (isLoading) {
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
          <div className="flex items-center justify-end mb-4">
            <label htmlFor="edit-toggle" className="mr-2 text-sm">
              Upravit
            </label>
            <input
              type="checkbox"
              id="edit-toggle"
              checked={isEditable}
              onChange={handleEditToggle}
              className="form-checkbox h-4 w-4 text-blue-600"
              aria-label="Přepnout do režimu editace"
            />
          </div>
        )}

        <form className="space-y-6">
          {/* ID Registrace */}
          {!isAddMode && (
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700"
              >
                ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                disabled
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
                aria-disabled="true"
                placeholder="ID registrace"
              />
            </div>
          )}

          {/* Jméno a Příjmení */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Jméno<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditable && !isAddMode}
                className={`mt-1 block w-full ${
                  isEditable || isAddMode
                    ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    : "bg-gray-100 border-gray-100 cursor-not-allowed"
                } rounded-md shadow-sm`}
                required
                aria-required="true"
                placeholder="Zadejte jméno"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Příjmení<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditable && !isAddMode}
                className={`mt-1 block w-full ${
                  isEditable || isAddMode
                    ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    : "bg-gray-100 border-gray-100 cursor-not-allowed"
                } rounded-md shadow-sm`}
                required
                aria-required="true"
                placeholder="Zadejte příjmení"
              />
            </div>
          </div>

          {/* Telefonní Číslo a Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Telefonní číslo<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditable && !isAddMode}
                className={`mt-1 block w-full ${
                  isEditable || isAddMode
                    ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    : "bg-gray-100 border-gray-100 cursor-not-allowed"
                } rounded-md shadow-sm`}
                required
                aria-required="true"
                placeholder="Zadejte telefonní číslo"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditable && !isAddMode}
                className={`mt-1 block w-full ${
                  isEditable || isAddMode
                    ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    : "bg-gray-100 border-gray-100 cursor-not-allowed"
                } rounded-md shadow-sm`}
                required
                aria-required="true"
                placeholder="Zadejte email"
              />
            </div>
          </div>

          {/* Termín a Datum Registrace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="termId"
                className="block text-sm font-medium text-gray-700"
              >
                Termín<span className="text-red-500">*</span>
              </label>
              <Select
                id="termId"
                value={formData.termId}
                onChange={handleTermChange}
                disabled={!isEditable && !isAddMode}
                className="mt-1 block w-full"
                placeholder="Vyberte termín"
                aria-required="true"
              >
                {termOptions.map((term) => (
                  <Option key={term.id} value={term.id}>
                    {term.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label
                htmlFor="registrationDate"
                className="block text-sm font-medium text-gray-700"
              >
                Datum registrace<span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="registrationDate"
                name="registrationDate"
                value={moment(formData.registrationDate)}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                disabled={!isEditable && !isAddMode}
                className={`mt-1 block w-full ${
                  isEditable || isAddMode
                    ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    : "bg-gray-100 border-gray-100 cursor-not-allowed"
                } rounded-md shadow-sm`}
                required
                aria-required="true"
              />
            </div>
          </div>

          {/* Poznámky */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Poznámky
            </label>
            <TextArea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              disabled={!isEditable && !isAddMode}
              className={`mt-1 block w-full ${
                isEditable || isAddMode
                  ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  : "bg-gray-100 border-gray-100 cursor-not-allowed"
              } rounded-md shadow-sm`}
              placeholder="Zadejte poznámky"
            />
          </div>

          {/* Tlačítka */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handleBack}
              className="bg-gray-300 hover:bg-gray-400 text-white"
            >
              Zpět
            </Button>
            {(isEditable || isAddMode) && (
              <div className="flex space-x-4">
                <Button
                  onClick={handleSave}
                  disabled={!isChanged && !isAddMode}
                  className={`${
                    isChanged || isAddMode
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-blue-300 cursor-not-allowed"
                  } text-white px-4 py-2 rounded-md flex items-center`}
                  icon={<SaveOutlined />}
                >
                  Uložit
                </Button>
                {!isAddMode && (
                  <Popconfirm
                    title="Opravdu chcete smazat tuto registraci?"
                    onConfirm={handleDelete}
                    okText="Ano"
                    cancelText="Ne"
                  >
                    <Button
                      danger
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                      icon={<DeleteOutlined />}
                    >
                      Smazat
                    </Button>
                  </Popconfirm>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationDetail;

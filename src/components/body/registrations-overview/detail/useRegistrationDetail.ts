import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import moment from "moment";
import { RegistrationFormData, TermOption } from "autoskola-web-shared-models";
import { useRegistrationsService } from "../../../../services/useRegistrationsService";

export const useRegistrationDetail = () => {
  const {
    createRegistration,
    deleteRegistration,
    updateRegistration,
    getRegistrationById,
    getRegistrationOptions,
  } = useRegistrationsService();

  const { id, termId } = useParams<{ id: string; termId: string }>();
  const navigate = useNavigate();
  const isAddMode = useMemo(() => id === "add", [id]);
  const [termOptions, setTermOptions] = useState<Array<TermOption>>([]);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    notes: "",
    phoneNumber: "",
    registrationDate: new Date(),
    termId: "",
  });
  const [initialData, setInitialData] = useState<RegistrationFormData | null>(
    null
  );
  const [isChanged, setIsChanged] = useState(false);
  const [isEditable, setIsEditable] = useState(isAddMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTermOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const options = await getRegistrationOptions();
      setTermOptions(options);
    } catch (err: any) {
      console.error("Chyba při načítání termínů:", err);
      setError(err.message || "Nepodařilo se načíst termíny.");
    } finally {
      setIsLoading(false);
    }
  }, [getRegistrationOptions]);

  const loadRegistration = useCallback(async () => {
    if (!isAddMode && id && termId) {
      try {
        setIsLoading(true);
        const data = await getRegistrationById(id, termId);
        const registrationWithDate = {
          ...data,
          registrationDate: moment(data.registrationDate).toDate(),
        };
        setFormData(registrationWithDate);
        setInitialData(registrationWithDate);
      } catch (err: any) {
        console.error("Chyba při načítání registrace:", err);
        setError(err.message || "Nepodařilo se načíst data registrace.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, termId, isAddMode, getRegistrationById]);

  useEffect(() => {
    loadTermOptions();
    loadRegistration();
  }, []);

  useEffect(() => {
    if (initialData) {
      const hasChanged = Object.keys(formData).some((key) => {
        if (key === "registrationDate") {
          return (
            (formData[key as keyof RegistrationFormData] as Date).getTime() !==
            (initialData[key as keyof RegistrationFormData] as Date).getTime()
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTermChange = (value: string) => {
    setFormData((prev) => ({ ...prev, termId: value }));
  };

  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, registrationDate: date.toDate() }));
    }
  };

  const handleEditToggle = (checked: boolean) => {
    setIsEditable(checked);
    if (!checked && initialData) {
      setFormData(initialData);
      setIsChanged(false);
    }
  };

  const handleSave = async () => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error("Prosím, zadejte platný email.");
      return;
    }

    setIsLoading(true);
    try {
      if (isAddMode) {
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
        navigate(`/registration-detail/${newRegistration.id}`);
      } else {
        // Update existing registration
        const updatedRegistration = await updateRegistration(formData);
        message.success("Registrace byla úspěšně aktualizována.");
        // Update initial data
        setInitialData({
          ...updatedRegistration,
          registrationDate: moment(
            updatedRegistration.registrationDate
          ).toDate(),
        });
      }
      setIsChanged(false);
    } catch (err: any) {
      console.error("Chyba při ukládání registrace:", err);
      message.error(err.message || "Nepodařilo se uložit registraci.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAddMode && formData.id && formData.termId) {
      setIsLoading(true);
      try {
        await deleteRegistration(formData.termId, formData.id);
        message.success("Registrace byla úspěšně smazána.");
        navigate("/app");
      } catch (err: any) {
        console.error("Chyba při mazání registrace:", err);
        message.error(err.message || "Nepodařilo se smazat registraci.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate("/app");
  };

  return {
    formData,
    termOptions,
    isLoading,
    error,
    isChanged,
    isEditable,
    isAddMode,
    handleChange,
    handleTermChange,
    handleDateChange,
    handleEditToggle,
    handleSave,
    handleDelete,
    handleBack,
  };
};

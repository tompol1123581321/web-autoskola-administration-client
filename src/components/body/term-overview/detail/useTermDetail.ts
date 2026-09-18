// src/components/body/terms-overview/TermDetail/useTermDetail.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { Term } from "autoskola-web-shared-models";
import { useTermsService } from "../../../../services/useTermsService";

type EditableTerm = Term & {
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
};

const DEFAULT_FORM_DATA = {
  id: "",
  label: "",
  registrations: [],
  termConfig: { maxRegistrationsCount: 0 },
  isActive: true,
  created: new Date(),
  description: "",
  startDate: undefined,
  endDate: undefined,
};

// OK

export const useTermDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addTerm, getTermById, updateTerm, deleteTerm } = useTermsService();
  const isAddMode = useMemo(() => id === "add", [id]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EditableTerm>(DEFAULT_FORM_DATA);

  const [initialData, setInitialData] = useState<EditableTerm | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isEditable, setIsEditable] = useState(isAddMode);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    if (id && !isAddMode) {
      setLoading(true);
      try {
        const term = await getTermById(id);
        setFormData(term);
        setInitialData(term);
      } catch (err: any) {
        setError(err.message || "Nepodařilo se načíst data termínu.");
      } finally {
        setLoading(false);
      }
    }
  }, [id, isAddMode, getTermById]);

  useEffect(() => {
    fetchData();
  }, []);

  const trackChanges = (updatedData: EditableTerm) => {
    if (
      isAddMode &&
      Object.values(updatedData).some((val) => val !== "" && val !== true)
    ) {
      setIsChanged(true);
      return;
    }
    if (!initialData) return;
    const hasChanged =
      updatedData.label !== initialData.label ||
      updatedData.description !== initialData.description ||
      updatedData.termConfig.maxRegistrationsCount !==
        initialData.termConfig.maxRegistrationsCount ||
      updatedData.isActive !== initialData.isActive ||
      String(updatedData.startDate) !== String(initialData.startDate) ||
      String(updatedData.endDate) !== String(initialData.endDate);
    setIsChanged(hasChanged);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      trackChanges(updated);
      return updated;
    });
  };

  const handleNumberChange = (value: number | null) => {
    setFormData((prev) => {
      const maxRegistrationsCount = value ?? 0;
      const updated = {
        ...prev,
        termConfig: { ...prev.termConfig, maxRegistrationsCount },
        isActive:
          maxRegistrationsCount > prev.registrations.length ? true : prev.isActive,
      };
      trackChanges(updated);
      return updated;
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, isActive: checked };
      trackChanges(updated);
      return updated;
    });
  };

  const handleDateChange = (field: "startDate" | "endDate", value: Date | null) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value || undefined };
      trackChanges(updated);
      return updated;
    });
  };

  const handleEditToggle = (checked: boolean) => {
    setIsEditable(checked);

    if (!checked && initialData) {
      setFormData(initialData);
      setIsChanged(false);
    }
  };

  const handleSave = async () => {
    if (!isChanged && !isAddMode) {
      message.warning("Nebyly detekovány žádné změny.");
      return;
    }
    if (!formData.label.trim() || !formData.startDate || !formData.endDate || formData.termConfig.maxRegistrationsCount < 1) {
      message.error("Vyplňte název, datumové rozmezí a maximální počet registrací.");
      return;
    }
    if (new Date(formData.endDate).getTime() <= new Date(formData.startDate).getTime()) {
      message.error("Konec termínu musí být po začátku.");
      return;
    }
    setLoading(true);
    try {
      if (isAddMode) {
        const newTerm = await addTerm({
          label: formData.label,
          description: formData.description,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          termConfig: {
            maxRegistrationsCount: formData.termConfig.maxRegistrationsCount,
          },
          isActive: formData.isActive,
        } as never);
        message.success("Nový termín byl úspěšně vytvořen.");
        navigate(`/app/terms/term-detail/${newTerm.id}`);
      } else {
        const updatedTerm = await updateTerm({
          id: formData.id,
          label: formData.label,
          description: formData.description,
          isActive: formData.isActive,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          termConfig: {
            maxRegistrationsCount: formData.termConfig.maxRegistrationsCount,
          },
        } as unknown as Term);
        message.success("Termín byl úspěšně aktualizován.");
        setInitialData(updatedTerm);
        setIsChanged(false);
      }
    } catch (err: any) {
      setError(err.message || "Nepodařilo se uložit termín.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    setLoading(true);
    try {
      await deleteTerm(formData.id);
      message.success("Termín byl úspěšně smazán.");
      navigate("/app/terms");
    } catch (err: any) {
      setError(err.message || "Nepodařilo se smazat termín.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/app/terms");
  };

  return {
    isAddMode,
    formData,
    isChanged,
    isEditable,
    loading,
    error,

    handleChange,
    handleNumberChange,
    handleCheckboxChange,
    handleDateChange,
    handleEditToggle,
    handleSave,
    handleDelete,
    handleBack,
  };
};

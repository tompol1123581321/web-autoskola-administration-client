// src/components/body/terms-overview/TermDetail/useTermDetail.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { Term } from "autoskola-web-shared-models";
import { useTermsService } from "../../../../services/useTermsService";

const DEFAULT_FORM_DATA = {
  id: "",
  label: "",
  registrations: [],
  termConfig: { maxRegistrationsCount: 0 },
  isActive: true,
  created: new Date(),
};

// OK

export const useTermDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addTerm, getTermById, updateTerm, deleteTerm } = useTermsService();
  const isAddMode = useMemo(() => id === "add", [id]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Term>(DEFAULT_FORM_DATA);

  const [initialData, setInitialData] = useState<Term | null>(null);
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

  const trackChanges = (updatedData: Term) => {
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
      updatedData.termConfig.maxRegistrationsCount !==
        initialData.termConfig.maxRegistrationsCount ||
      updatedData.isActive !== initialData.isActive;
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
      const updated = {
        ...prev,
        termConfig: { ...prev.termConfig, maxRegistrationsCount: value || 0 },
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
    setLoading(true);
    try {
      if (isAddMode) {
        const newTerm = await addTerm({
          label: formData.label,
          termConfig: {
            maxRegistrationsCount: formData.termConfig.maxRegistrationsCount,
          },
          isActive: formData.isActive,
        });
        message.success("Nový termín byl úspěšně vytvořen.");
        navigate(`/app/terms/term-detail/${newTerm.id}`);
      } else {
        const updatedTerm = await updateTerm(formData);
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
    handleEditToggle,
    handleSave,
    handleDelete,
    handleBack,
  };
};

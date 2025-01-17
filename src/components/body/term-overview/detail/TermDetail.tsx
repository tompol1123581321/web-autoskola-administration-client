// src/components/body/terms-overview/TermDetail.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Input,
  Button,
  message,
  Form,
  Row,
  Col,
  Checkbox,
  Spin,
  Alert,
  InputNumber,
} from "antd";
import { Term } from "autoskola-web-shared-models";
import { useParams, useNavigate } from "react-router-dom";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import moment from "moment";
import { useTermsService } from "../../../../services/useTermsService";

// Komponenta pro přidávání/editaci termínu
export const TermDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addTerm, getTermById, updateTerm, deleteTerm } = useTermsService();

  // Určení, zda je formulář v režimu Přidat nebo Upravit
  const isAddMode = useMemo(() => id === "add", [id]);

  // Stav pro data formuláře
  const [formData, setFormData] = useState<Term>(
    isAddMode
      ? {
          id: "", // Bude generováno backendem
          label: "",
          registrations: [],
          termConfig: { maxRegistrationsCount: 0 },
          isActive: true,
          created: new Date(),
        }
      : {
          id: "",
          label: "",
          registrations: [],
          termConfig: { maxRegistrationsCount: 0 },
          isActive: true,
          created: new Date(),
        }
  );

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
  }, [isAddMode, id, getTermById]);

  useEffect(() => {
    fetchData();
  }, []);

  // Zpracování změn ve vstupních polích formuláře
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    trackChanges({ ...formData, [name]: value });
  };

  // Zpracování změn pro číselný vstup (maxRegistrationsCount)
  const handleNumberChange = (value: number | null) => {
    setFormData((prev) => ({
      ...prev,
      termConfig: { ...prev.termConfig, maxRegistrationsCount: value || 0 },
    }));
    trackChanges({
      ...formData,
      termConfig: { ...formData.termConfig, maxRegistrationsCount: value || 0 },
    });
  };

  // Zpracování změny checkboxu pro isActive
  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
    trackChanges({ ...formData, isActive: e.target.checked });
  };

  // Sledování, zda byly provedeny nějaké změny pro povolení tlačítka Uložit
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

  // Zpracování akce Uložit
  const handleSave = async () => {
    if (!isChanged && !isAddMode) {
      message.warning("Nebyly detekovány žádné změny.");
      return;
    }

    setLoading(true);
    try {
      if (isAddMode) {
        // Vytvoření nového termínu
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
        // Aktualizace existujícího termínu
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

  // Zpracování akce Smazat
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

  // Zpracování akce Zpět
  const handleBack = () => {
    navigate("/app/terms");
  };

  // Zpracování přepínače Upravit
  const handleEditToggle = (e: CheckboxChangeEvent) => {
    setIsEditable(e.target.checked);
    if (!e.target.checked && initialData) {
      setFormData(initialData);
      setIsChanged(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin
          tip={isAddMode ? "Vytváření termínu..." : "Načítání termínu..."}
          size="large"
        />
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
          {isAddMode ? "Přidat nový termín" : "Detaily termínu"}
        </h2>

        {/* Přepínač Upravit (skrytý v režimu Přidat) */}
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
          {/* ID termínu (pouze pro čtení) */}
          {!isAddMode && (
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="ID">
                  <Input
                    value={formData.id}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                    placeholder="ID termínu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Vytvořeno">
                  <Input
                    value={moment(formData.created).format("YYYY-MM-DD HH:mm")}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* Název termínu */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Název termínu"
                rules={[
                  { required: true, message: "Název termínu je povinný." },
                ]}
              >
                <Input
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md`}
                  placeholder="Zadejte název termínu"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Maximální počet registrací"
                rules={[
                  {
                    required: true,
                    message: "Maximální počet registrací je povinný.",
                  },
                  { type: "number", min: 1, message: "Musí být alespoň 1." },
                ]}
              >
                <InputNumber
                  min={1}
                  value={formData.termConfig.maxRegistrationsCount}
                  onChange={handleNumberChange}
                  disabled={!isEditable && !isAddMode}
                  className={`border ${
                    isEditable || isAddMode
                      ? "border-gray-300"
                      : "border-gray-100 cursor-not-allowed"
                  } rounded-md w-full`}
                  placeholder="Zadejte maximální počet registrací"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Konfigurace termínu */}
          <Row>
            <Col span={12}>
              <Form.Item label="Aktivní">
                <Checkbox
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  disabled={!isEditable && !isAddMode}
                >
                  Aktivní
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-between mt-6">
            <Button type="primary" onClick={handleBack}>
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
                  <Button danger onClick={handleDelete}>
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

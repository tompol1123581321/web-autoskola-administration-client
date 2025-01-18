// src/components/body/registrations-overview/PublicWebSettings/usePublicWebSettings.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Input, message, Popconfirm } from "antd";
import { WebSettings } from "autoskola-web-shared-models";
import { DeleteOutlined } from "@ant-design/icons";
import { useWebSettingsService } from "../../../services/useWebSettingsService";

export const usePublicWebSettings = () => {
  const { getCurrentWebSettings, saveNewWebSettings } = useWebSettingsService();

  const [priceList, setPriceList] = useState<WebSettings["priceList"]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const fetchWebSettings = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await getCurrentWebSettings();
      setPriceList(settings?.priceList || []);
    } catch (err: any) {
      setError(err.message || "Nepodařilo se načíst webová nastavení.");
    } finally {
      setLoading(false);
    }
  }, [getCurrentWebSettings]);

  useEffect(() => {
    fetchWebSettings();
  }, []);

  const handleInputChange = useCallback(
    (index: number, field: "label" | "value", newValue: string) => {
      const updatedPriceList = [...priceList];
      updatedPriceList[index][field] = newValue;
      setPriceList(updatedPriceList);
      setIsChanged(true);
    },
    [priceList]
  );

  const handleAdd = useCallback(() => {
    setPriceList((prev) => [...prev, { label: "", value: "" }]);
    setIsChanged(true);
  }, []);

  const handleDelete = useCallback(
    (index: number) => {
      const updatedPriceList = [...priceList];
      updatedPriceList.splice(index, 1);
      setPriceList(updatedPriceList);
      setIsChanged(true);
    },
    [priceList]
  );

  const handleSave = useCallback(async () => {
    for (let i = 0; i < priceList.length; i++) {
      const item = priceList[i];
      if (!item.label.trim()) {
        message.error(`Položka ${i + 1}: Název je povinný.`);
        return;
      }
      if (!item.value.trim()) {
        message.error(`Položka ${i + 1}: Hodnota je povinná.`);
        return;
      }
    }

    setLoading(true);
    try {
      const newSettings: WebSettings = { priceList };
      await saveNewWebSettings(newSettings);
      await fetchWebSettings();
      message.success("Webová nastavení byla úspěšně aktualizována.");
      setIsChanged(false);
    } catch (err: any) {
      setError(err.message || "Nepodařilo se uložit webová nastavení.");
    } finally {
      setLoading(false);
    }
  }, [priceList, saveNewWebSettings, fetchWebSettings]);

  const handleReset = useCallback(async () => {
    await fetchWebSettings();
    setIsChanged(false);
    message.info("Změny byly resetovány.");
  }, [fetchWebSettings]);

  const columns = useMemo(
    () => [
      {
        title: "Název",
        dataIndex: "label",
        key: "label",
        render: (_: unknown, __: unknown, index: number) => (
          <Input
            value={priceList[index].label}
            placeholder="Název"
            onChange={(e) => handleInputChange(index, "label", e.target.value)}
          />
        ),
      },
      {
        title: "Hodnota",
        dataIndex: "value",
        key: "value",
        render: (_: unknown, __: unknown, index: number) => (
          <Input
            value={priceList[index].value}
            placeholder="Hodnota"
            onChange={(e) => handleInputChange(index, "value", e.target.value)}
          />
        ),
      },
      {
        title: "Akce",
        key: "action",
        render: (_: unknown, __: unknown, index: number) =>
          index >= 0 && (
            <Popconfirm
              title="Opravdu chcete smazat tuto položku?"
              onConfirm={() => handleDelete(index)}
              okText="Ano"
              cancelText="Ne"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          ),
      },
    ],
    [priceList, handleInputChange, handleDelete]
  );

  return {
    priceList,
    loading,
    error,
    isChanged,
    columns,

    handleAdd,
    handleSave,
    handleReset,
  };
};

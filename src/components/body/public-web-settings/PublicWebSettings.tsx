import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Spin,
  Alert,
  Popconfirm,
  Typography,
} from "antd";
import { useWebSettingsService } from "../../../services/useWebSettingsService";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { WebSettings } from "autoskola-web-shared-models";

export const PublicWebSettings: React.FC = () => {
  const { getCurrentWebSettings, saveNewWebSettings } = useWebSettingsService();

  const [priceList, setPriceList] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isChanged, setIsChanged] = useState<boolean>(false);

  // Načtení aktuálních webových nastavení
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

  // Sledování změn ve formuláři pro povolení tlačítka Uložit
  const handleInputChange = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const updatedPriceList = [...priceList];
    updatedPriceList[index][field] = value;
    setPriceList(updatedPriceList);
    setIsChanged(true);
  };

  // Přidání nové položky do priceList
  const handleAdd = () => {
    setPriceList([...priceList, { label: "", value: "" }]);
    setIsChanged(true);
  };

  // Smazání položky z priceList
  const handleDelete = (index: number) => {
    const updatedPriceList = [...priceList];
    updatedPriceList.splice(index, 1);
    setPriceList(updatedPriceList);
    setIsChanged(true);
  };

  // Ošetření odeslání formuláře
  const handleSave = async () => {
    // Validace: zkontrolovat, že všechny položky mají vyplněné label a value
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
  };

  // Resetování změn na původní data
  const handleReset = async () => {
    await fetchWebSettings();
    setIsChanged(false);
    message.info("Změny byly resetovány.");
  };

  // Definice sloupců tabulky
  const columns = [
    {
      title: "Název",
      dataIndex: "label",
      key: "label",
      render: (_: any, __: any, index: number) => (
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
      render: (_: any, __: any, index: number) => (
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
      render: (_: any, __: any, index: number) => (
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
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Načítání webových nastavení..." size="large" />
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
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Nastavení veřejného webu
        </h2>

        <Typography.Title level={4}>Ceník</Typography.Title>
        <Table
          dataSource={priceList.map((item, index) => ({ key: index, ...item }))}
          columns={columns}
          pagination={false}
          bordered
          rowKey="key"
        />

        <Button
          type="dashed"
          onClick={handleAdd}
          block
          icon={<PlusOutlined />}
          className="mt-4"
        >
          Přidat položku
        </Button>

        <div className="flex justify-end mt-6 space-x-4">
          <Button danger onClick={handleReset} disabled={!isChanged}>
            Resetovat
          </Button>
          <Button
            className="bg-blue-400 hover:bg-blue-600"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={!isChanged}
          >
            Uložit
          </Button>
        </div>
      </div>
    </div>
  );
};

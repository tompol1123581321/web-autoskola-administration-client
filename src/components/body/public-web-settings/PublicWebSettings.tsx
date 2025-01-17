// src/components/PublicWebSettings.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Form,
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

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [webSettings, setWebSettings] = useState<WebSettings | null>(null);
  const [error, setError] = useState<string>("");
  const [isChanged, setIsChanged] = useState<boolean>(false);

  // Načtení aktuálních webových nastavení
  const fetchWebSettings = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await getCurrentWebSettings();
      console.log({ settings });
      setWebSettings(settings);
      form.setFieldsValue({
        priceList: settings?.priceList,
      });
    } catch (err: any) {
      setError(err.message || "Nepodařilo se načíst webová nastavení.");
    } finally {
      setLoading(false);
    }
  }, [getCurrentWebSettings, form]);

  useEffect(() => {
    fetchWebSettings();
  }, []);

  // Sledování změn ve formuláři pro povolení tlačítka Uložit
  const handleFormChange = () => {
    setIsChanged(true);
  };

  // Ošetření odeslání formuláře
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await saveNewWebSettings(values);
      message.success("Webová nastavení byla úspěšně aktualizována.");
      setIsChanged(false);
      fetchWebSettings(); // Obnovení dat
    } catch (err: any) {
      if (err.name !== "Error") {
        setError(err.message || "Nepodařilo se uložit webová nastavení.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Definice sloupců tabulky
  const columns = [
    {
      title: "Název",
      dataIndex: "label",
      key: "label",
      render: (_: any, __: any, index: number) => (
        <Form.Item
          name={["priceList", index, "label"]}
          rules={[{ required: true, message: "Prosím, zadejte název." }]}
          style={{ margin: 0 }}
        >
          <Input placeholder="Název" />
        </Form.Item>
      ),
    },
    {
      title: "Hodnota",
      dataIndex: "value",
      key: "value",
      render: (_: any, __: any, index: number) => (
        <Form.Item
          name={["priceList", index, "value"]}
          rules={[{ required: true, message: "Prosím, zadejte hodnotu." }]}
          style={{ margin: 0 }}
        >
          <Input placeholder="Hodnota" />
        </Form.Item>
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

  // Přidání nové položky do priceList
  const handleAdd = () => {
    const priceList = form.getFieldValue("priceList") || [];
    const newItem = { label: "", value: "" };
    form.setFieldsValue({
      priceList: [...priceList, newItem],
    });
    setIsChanged(true);
  };

  // Smazání položky z priceList
  const handleDelete = (index: number) => {
    const priceList = form.getFieldValue("priceList") || [];
    priceList.splice(index, 1);
    form.setFieldsValue({
      priceList,
    });
    setIsChanged(true);
  };

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

        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          initialValues={{
            priceList: webSettings?.priceList || [],
          }}
        >
          <Typography.Title level={4}>Ceník</Typography.Title>
          <Form.List name="priceList">
            {(fields) => (
              <>
                <Table
                  dataSource={fields}
                  columns={columns}
                  rowKey={(field) => field.key}
                  pagination={false}
                  bordered
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
              </>
            )}
          </Form.List>

          <div className="flex justify-end mt-6 space-x-4">
            <Button
              danger
              onClick={() => form.resetFields()}
              disabled={!isChanged}
            >
              Resetovat
            </Button>
            <Button
              className="bg-blue-400 hover:to-blue-600"
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              disabled={!isChanged}
            >
              Uložit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

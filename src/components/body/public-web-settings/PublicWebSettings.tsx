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

  // Fetch current web settings
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
      setError(err.message || "Failed to load web settings.");
    } finally {
      setLoading(false);
    }
  }, [getCurrentWebSettings, form]);

  useEffect(() => {
    fetchWebSettings();
  }, []);

  // Handle form changes to track if any changes have been made
  const handleFormChange = () => {
    setIsChanged(true);
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await saveNewWebSettings(values);
      message.success("Web settings updated successfully.");
      setIsChanged(false);
      fetchWebSettings(); // Refresh the data
    } catch (err: any) {
      if (err.name !== "Error") {
        setError(err.message || "Failed to save web settings.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      render: (_: any, __: any, index: number) => (
        <Form.Item
          name={["priceList", index, "label"]}
          rules={[{ required: true, message: "Please enter a label." }]}
          style={{ margin: 0 }}
        >
          <Input placeholder="Label" />
        </Form.Item>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (_: any, __: any, index: number) => (
        <Form.Item
          name={["priceList", index, "value"]}
          rules={[{ required: true, message: "Please enter a value." }]}
          style={{ margin: 0 }}
        >
          <Input placeholder="Value" />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, __: any, index: number) => (
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => handleDelete(index)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  // Handle adding a new priceList item
  const handleAdd = () => {
    const priceList = form.getFieldValue("priceList") || [];
    const newItem = { label: "", value: "" };
    form.setFieldsValue({
      priceList: [...priceList, newItem],
    });
    setIsChanged(true);
  };

  // Handle deleting a priceList item
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
        <Spin tip="Loading Web Settings..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          message="Error"
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
          Public Web Settings
        </h2>

        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          initialValues={{
            priceList: webSettings?.priceList || [],
          }}
        >
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
                  Add Item
                </Button>
              </>
            )}
          </Form.List>

          <div className="flex justify-end mt-6 space-x-4">
            <Button onClick={() => form.resetFields()} disabled={!isChanged}>
              Reset
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              disabled={!isChanged}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

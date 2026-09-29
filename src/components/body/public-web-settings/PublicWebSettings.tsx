import React from "react";
import { Typography, Table, Button, Spin, Alert } from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { usePublicWebSettings } from "./usePublicSettings";
import { SortableRow } from "./SortableRow";

export const PublicWebSettings: React.FC = () => {
  const {
    priceList,
    loading,
    error,
    isChanged,
    columns,
    handleAdd,
    handleSave,
    handleReset,
    handleDragEnd,
  } = usePublicWebSettings();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin tip="Načítání webových nastavení..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Alert message="Chyba" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div
      className="max-w-screen-xl"
      style={{
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 6,
      }}
    >
      <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        Nastavení veřejného webu
      </Typography.Title>

      <Typography.Title level={4}>Ceník</Typography.Title>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={priceList.map((item) => item._id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            dataSource={priceList.map((item) => ({ ...item, key: item._id }))}
            columns={columns}
            pagination={false}
            bordered
            style={{ marginTop: 16 }}
            components={{ body: { row: SortableRow } }}
          />
        </SortableContext>
      </DndContext>

      <Button
        type="dashed"
        onClick={handleAdd}
        block
        icon={<PlusOutlined />}
        style={{ marginTop: 16 }}
      >
        Přidat položku
      </Button>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 24,
          gap: 8,
        }}
      >
        <Button danger onClick={handleReset} disabled={!isChanged}>
          Resetovat
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          disabled={!isChanged}
        >
          Uložit
        </Button>
      </div>

    </div>
  );
};

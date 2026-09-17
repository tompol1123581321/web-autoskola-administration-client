import { ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Descriptions, Empty, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { WebSettingsData, useWebSettingsService } from "../../../services/useWebSettingsService";
import { formatDateTime } from "../../../utils/dateUtils";

type HistoryEntry = {
  key: string;
  value: WebSettingsData;
  updatedAt: string;
};

const columns: ColumnsType<HistoryEntry> = [
  {
    title: "Uloženo",
    dataIndex: "updatedAt",
    render: (value: string) => formatDateTime(value),
  },
  {
    title: "Ceník",
    dataIndex: "value",
    render: (value: WebSettingsData) => <Tag color="blue">{value.priceList.length} položek</Tag>,
  },
  {
    title: "Nabízené termíny",
    dataIndex: "value",
    render: (value: WebSettingsData) => <Tag color="green">{value.termOptions.length} voleb</Tag>,
  },
];

export const ChangesAudit = () => {
  const { getWebSettingsHistory } = useWebSettingsService();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });

  const loadHistory = useCallback(async (page = 1, pageSize = 20) => {
    setLoading(true);
    setError("");
    try {
      const response = await getWebSettingsHistory(page, pageSize);
      setEntries(response.data);
      setPagination({ page: response.page, pageSize: response.pageSize, total: response.total });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Nepodařilo se načíst přehled změn.");
    } finally {
      setLoading(false);
    }
  }, [getWebSettingsHistory]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <main className="max-w-screen-xl mx-auto p-4 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <Typography.Title level={2} className="!mb-1">Přehled změn</Typography.Title>
          <Typography.Text type="secondary">Historie uložených verzí nastavení veřejného webu.</Typography.Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => loadHistory(pagination.page, pagination.pageSize)} loading={loading}>
          Obnovit
        </Button>
      </div>

      {error && <Alert className="mb-4" type="error" message="Nepodařilo se načíst historii" description={error} showIcon />}

      <Table<HistoryEntry>
        rowKey="key"
        loading={loading}
        columns={columns}
        dataSource={entries}
        locale={{ emptyText: <Empty description="Zatím nebyla uložena žádná starší verze nastavení." image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
        expandable={{
          expandedRowRender: (entry: HistoryEntry) => (
            <Space direction="vertical" size="middle" className="w-full">
              <Descriptions size="small" column={1} title="Ceník">
                {entry.value.priceList.length ? entry.value.priceList.map((item, index) => (
                  <Descriptions.Item key={`${item.label}-${index}`} label={item.label}>{item.value}</Descriptions.Item>
                )) : <Descriptions.Item label="Stav">Bez položek</Descriptions.Item>}
              </Descriptions>
              <Descriptions size="small" column={1} title="Nabízené termíny">
                {entry.value.termOptions.length ? entry.value.termOptions.map((item) => (
                  <Descriptions.Item key={item.id} label={item.label}>{item.id}</Descriptions.Item>
                )) : <Descriptions.Item label="Stav">Bez voleb</Descriptions.Item>}
              </Descriptions>
            </Space>
          ),
          expandIconColumnIndex: 0,
        }}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showQuickJumper: { goButton: "Přejít" },
          showTotal: (total: number) => `Celkem ${total} verzí`,
          onChange: (page: number, pageSize: number) => loadHistory(page, pageSize),
        }}
      />
    </main>
  );
};

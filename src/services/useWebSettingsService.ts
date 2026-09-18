// src/hooks/services/useWebSettingsService.ts

import { useCallback } from "react";
import { COMMON_ADMIN_API } from "../constants/api";
import useApi from "../hooks/api/useApi";

export type WebSettingsData = {
  priceList: Array<{ label: string; value: string }>;
  termOptions: Array<{ id: string; label: string }>;
};

export type WebSettingsHistory = {
  data: Array<{ key: string; value: WebSettingsData; updatedAt: string }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type WebSettingsResponse = WebSettingsData | WebSettingsHistory;

const normalizeWebSettings = (
  settings?: Partial<WebSettingsData>
): WebSettingsData => ({
  priceList: settings?.priceList ?? [],
  termOptions: settings?.termOptions ?? [],
});

interface WebSettingsService {
  getWebSettingsHistory: (page: number, pageSize: number) => Promise<WebSettingsHistory>;
  saveNewWebSettings: (settings: WebSettingsData) => Promise<WebSettingsData>;
  getCurrentWebSettings: () => Promise<WebSettingsData>;
}

export const useWebSettingsService = (): WebSettingsService => {
  const apiFetch = useApi();

  /**
   * 1. Get WebSettings History (Authorized)
   * Endpoint: GET /api/webSettings
   */
  const getWebSettingsHistory = useCallback(async (page: number, pageSize: number): Promise<WebSettingsHistory> => {
    const url = `${COMMON_ADMIN_API}/webSettings/history?page=${page}&pageSize=${pageSize}`;

    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Nepodařilo se načíst historii nastavení webu."
      );
    }

    const data: WebSettingsHistory = await response.json();
    return {
      ...data,
      data: data.data.map((entry) => ({
        ...entry,
        value: normalizeWebSettings(entry.value),
      })),
    };
  }, [apiFetch]);

  /**
   * 2. Save New WebSettings (Authorized)
   * Endpoint: POST /api/webSettings/add
   */
  const saveNewWebSettings = useCallback(
    async (settings: WebSettingsData): Promise<WebSettingsData> => {
      const url = `${COMMON_ADMIN_API}/webSettings/add`;

      const response = await apiFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || "Nepodařilo se uložit webová nastavení.");
        Object.assign(error, { status: response.status });
        throw error;
      }

      const data = await response.json();
      return data.settings ?? data;
    },
    [apiFetch]
  );

  /**
   * 3. Get Current WebSettings (No Auth Required)
   * Endpoint: GET /api/webSettings/current
   */
  const getCurrentWebSettings = useCallback(async (): Promise<WebSettingsData> => {
    const url = `${COMMON_ADMIN_API}/webSettings/current`;

    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Nepodařilo se načíst aktuální nastavení webu."
      );
    }

    const data: WebSettingsResponse = await response.json();

    if ("data" in data) {
      return normalizeWebSettings(data.data[0]?.value);
    }

    return normalizeWebSettings(data);
  }, [apiFetch]);

  return {
    getWebSettingsHistory,
    saveNewWebSettings,
    getCurrentWebSettings,
  };
};

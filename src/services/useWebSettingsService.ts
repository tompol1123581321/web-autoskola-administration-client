// src/hooks/services/useWebSettingsService.ts

import { useCallback } from "react";
import { COMMON_ADMIN_API } from "../constants/api";
import useApi from "../hooks/api/useApi";
import { WebSettings } from "autoskola-web-shared-models";

interface WebSettingsService {
  getWebSettingsHistory: () => Promise<Array<WebSettings>>;
  saveNewWebSettings: (settings: WebSettings) => Promise<WebSettings>;
  getCurrentWebSettings: () => Promise<WebSettings>;
}

export const useWebSettingsService = (): WebSettingsService => {
  const apiFetch = useApi();

  /**
   * 1. Get WebSettings History (Authorized)
   * Endpoint: GET /api/webSettings
   */
  const getWebSettingsHistory = useCallback(async (): Promise<
    Array<WebSettings>
  > => {
    const url = `${COMMON_ADMIN_API}/webSettings`;

    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch web settings history."
      );
    }

    const data = await response.json();
    return data.history; // Adjust based on actual response structure
  }, [apiFetch]);

  /**
   * 2. Save New WebSettings (Authorized)
   * Endpoint: POST /api/webSettings/add
   */
  const saveNewWebSettings = useCallback(
    async (settings: WebSettings): Promise<WebSettings> => {
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
        throw new Error(errorData.error || "Failed to save new web settings.");
      }

      const data = await response.json();
      return data.settings; // Adjust based on actual response structure
    },
    [apiFetch]
  );

  /**
   * 3. Get Current WebSettings (No Auth Required)
   * Endpoint: GET /api/webSettings/current
   */
  const getCurrentWebSettings = useCallback(async (): Promise<WebSettings> => {
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
        errorData.error || "Failed to fetch current web settings."
      );
    }

    const data = await response.json();
    return data; // Adjust based on actual response structure
  }, [apiFetch]);

  return {
    getWebSettingsHistory,
    saveNewWebSettings,
    getCurrentWebSettings,
  };
};

// hooks/services/useWebSettingsService.ts

import { useCallback } from "react";
import { COMMON_ADMIN_API } from "../constants/api";
import useApi from "../hooks/api/useApi";

interface WebSettingsService {
  fetchWebSettings: () => Promise<object>;
  saveNewWebSettings: (settings: object) => Promise<object>;
}

const useWebSettingsService = (): WebSettingsService => {
  const apiFetch = useApi();

  const fetchWebSettings = useCallback(async (): Promise<object> => {
    const url = `${COMMON_ADMIN_API}/webSettings`;

    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch web settings.");
    }

    const data = await response.json();
    return data;
  }, [apiFetch]);

  const saveNewWebSettings = useCallback(
    async (settings: object): Promise<object> => {
      const url = `${COMMON_ADMIN_API}/newWebSettings`;

      const response = await apiFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save web settings.");
      }

      const data = await response.json();
      return data;
    },
    [apiFetch]
  );

  return {
    fetchWebSettings,
    saveNewWebSettings,
  };
};

export default useWebSettingsService;

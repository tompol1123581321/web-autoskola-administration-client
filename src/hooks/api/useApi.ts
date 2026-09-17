// hooks/useApi.ts

import { useCallback, useContext } from "react";
import { LoginContext } from "../login/LoginContextProvider";

const useApi = () => {
  const { clearAuth } = useContext(LoginContext);

  const apiFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include", // Ensure cookies are included
      });

      if (response.status === 401) {
        // Unauthorized, perform logout
        clearAuth();
        throw new Error("Vaše přihlášení vypršelo. Přihlaste se prosím znovu.");
      }

      return response;
    } catch (error) {
      console.error("Chyba API:", error);
      throw error;
    }
  }, [clearAuth]);

  return apiFetch;
};

export default useApi;

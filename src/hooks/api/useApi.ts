// hooks/useApi.ts

import { useContext } from "react";
import { LoginContext } from "../login/LoginContextProvider";

const useApi = () => {
  const { logout } = useContext(LoginContext);

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include", // Ensure cookies are included
      });

      if (response.status === 401) {
        // Unauthorized, perform logout
        logout();
        throw new Error("Unauthorized");
      }

      return response;
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  };

  return apiFetch;
};

export default useApi;

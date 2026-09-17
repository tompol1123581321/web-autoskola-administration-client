// hooks/login/useLogin.ts

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContextProvider";
import { Administrator } from "autoskola-web-shared-models";
import {
  loginAdminRequest,
  logoutAdminRequest,
} from "../../services/loginService";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, clearAuth } = useContext(LoginContext);

  const login = async (userData: Omit<Administrator, "email">) => {
    try {
      const { isAuthorized, user } = await loginAdminRequest(userData);
      setUser(isAuthorized && user ? user : null);

      if (isAuthorized) {
        navigate("/app", { replace: true });
      } else {
        throw new Error("Přihlášení nebylo autorizováno. Zkontrolujte přihlašovací údaje.");
      }
    } catch (error) {
      console.error("Přihlášení se nepodařilo:", error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logoutAdminRequest();
    } catch (e) {
      console.log(e);
    } finally {
      clearAuth();
      navigate("/", { replace: true });
    }
  };

  return { login, logout: logoutUser };
};

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
  const { update } = useContext(LoginContext);

  const login = async (userData: Omit<Administrator, "email">) => {
    try {
      const { isAuthorized, user } = await loginAdminRequest(userData);
      update({ isLoggedIn: isAuthorized, userName: user?.name });

      if (isAuthorized) {
        navigate("/app", { replace: true });
      } else {
        throw new Error("Authorization failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logoutAdminRequest();
    } catch (e) {
      console.log(e);
    } finally {
      update({ isLoggedIn: false, userName: undefined });
      navigate("/", { replace: true });
    }
  };

  return { login, logout: logoutUser };
};

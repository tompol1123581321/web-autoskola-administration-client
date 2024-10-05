import { Administrator } from "autoskola-web-shared-models";
import { loginAdmin } from "../../services/loginService";
import { useContext } from "react";
import { LoginContext } from "./LoginContextProvider";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const {
    update,
    value: { isLoggedIn, jwt },
  } = useContext(LoginContext);
  const login = async (userData: Administrator) => {
    const { isAuthorized, token } = await loginAdmin(userData);
    update({ isLoggedIn: isAuthorized, jwt: token });
  };

  const logout = async () => {
    update({ isLoggedIn: false });
    navigate("/");
  };

  const withToken = (
    asyncCb: <T, R>(token: string, ...args: T[]) => Promise<R>
  ) => {
    return async (...args: any[]) => {
      if (!jwt) {
        await logout();
        return;
      }
      try {
        const result = await asyncCb(jwt, ...args);
        return result;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          await logout();
        } else {
          throw error;
        }
      }
    };
  };

  return { login, isLoggedIn, jwt, logout, withToken };
};

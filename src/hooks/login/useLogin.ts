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
  const login = async (userData: Omit<Administrator, "email">) => {
    const { isAuthorized, token } = await loginAdmin(userData);
    update({ isLoggedIn: isAuthorized, jwt: token });
  };

  const logout = async () => {
    update({ isLoggedIn: false });
    navigate("/");
  };

  return { login, isLoggedIn, jwt, logout };
};

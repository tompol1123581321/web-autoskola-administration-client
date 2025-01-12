// hooks/login/useLogin.ts

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginContextProvider";
import { Administrator } from "autoskola-web-shared-models";
import { COMMON_ADMIN_API } from "../../constants/api";

interface LoginAdminResponse {
  isAuthorized: boolean;
  user?: { name: string };
}

export const loginAdminRequest = async (
  administratorData: Omit<Administrator, "email">
): Promise<LoginAdminResponse> => {
  try {
    const response = await fetch(`${COMMON_ADMIN_API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(administratorData),
      credentials: "include", // Include cookies in the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! Status: ${response.status}`
      );
    }

    const data: LoginAdminResponse = await response.json();
    return data; // Return the typed response data
  } catch (e) {
    console.error("Error during login:", e);
    throw e; // Rethrow the error to be handled by the caller
  }
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { update } = useContext(LoginContext);

  const login = async (userData: Omit<Administrator, "email">) => {
    try {
      const { isAuthorized, user } = await loginAdminRequest(userData);
      update({ isLoggedIn: isAuthorized, userName: user?.name });

      if (isAuthorized) {
        navigate("/app", { replace: true }); // Redirect to /app upon successful login
      } else {
        throw new Error("Authorization failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate the error to be handled in the component
    }
  };

  const logoutUser = async () => {
    // Make a logout API call to the server
    try {
      const response = await fetch(`${COMMON_ADMIN_API}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, display an error message to the user
    }

    update({ isLoggedIn: false, userName: undefined });
    navigate("/", { replace: true }); // Redirect to login page
  };

  return { login, logout: logoutUser };
};

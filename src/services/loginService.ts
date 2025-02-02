import { Administrator } from "autoskola-web-shared-models";
import { COMMON_ADMIN_API } from "../constants/api";

// Define the response type based on the server's response structure
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

export const logoutAdminRequest = async () => {
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
    throw new Error(error as string);
  }
};

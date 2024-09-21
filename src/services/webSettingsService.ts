import { COMMON_ADMIN_API } from "../constants/api";

export const fetchWebSettings = async (): Promise<object> => {
  try {
    const response = await fetch(`${COMMON_ADMIN_API}/webSettings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies if authentication is needed
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch web settings: ${response.status} ${response.statusText}`
      );
    }

    const data: object = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching web settings:", error);
    throw error;
  }
};

export const saveNewWebSettings = async (settings: object): Promise<object> => {
  try {
    const response = await fetch(`${COMMON_ADMIN_API}/newWebSettings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to save web settings: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving web settings:", error);
    throw error;
  }
};

// src/services/useRegistrationsService.ts

import { useCallback } from "react";
import {
  RegistrationFormData,
  RegistrationsFilter,
  TermOption, // Assuming this is the type returned by /options
} from "autoskola-web-shared-models";
import useApi from "../hooks/api/useApi";
import { COMMON_ADMIN_API } from "../constants/api";

interface RegistrationService {
  getRegistrations: (
    filter: RegistrationsFilter
  ) => Promise<RegistrationFormData[]>;
  deleteRegistration: (termId: string, registrationId: string) => Promise<void>;
  createRegistration: (
    registration: Omit<RegistrationFormData, "id">
  ) => Promise<RegistrationFormData>;
  updateRegistration: (
    registration: RegistrationFormData
  ) => Promise<RegistrationFormData>;
  getRegistrationOptions: () => Promise<TermOption[]>;
  getRegistrationById: (
    id: string,
    termId: string
  ) => Promise<RegistrationFormData>;
}

export const useRegistrationsService = (): RegistrationService => {
  const apiFetch = useApi();

  // 1. Create a new registration
  const createRegistration = useCallback(
    async (
      registration: Omit<RegistrationFormData, "id">
    ): Promise<RegistrationFormData> => {
      const url = `${COMMON_ADMIN_API}/registrations/add`;

      const response = await apiFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registration),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create registration.");
      }

      const data = await response.json();
      return data; // Adjust based on actual response structure
    },
    [apiFetch]
  );

  // 2. Get registration form options
  const getRegistrationOptions = useCallback(async (): Promise<
    TermOption[]
  > => {
    const url = `${COMMON_ADMIN_API}/registrations/options`;

    const response = await apiFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch registration options."
      );
    }

    const data = await response.json();
    return data; // Adjust based on actual response structure
  }, [apiFetch]);

  // 3. Get registrations with filters
  const getRegistrations = useCallback(
    async (filter: RegistrationsFilter): Promise<RegistrationFormData[]> => {
      const url = `${COMMON_ADMIN_API}/registrations`;

      const response = await apiFetch(url, {
        method: "POST",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch registrations.");
      }

      const data = await response.json();
      return data; // Adjust based on actual response structure
    },
    [apiFetch]
  );

  // 4. Update a registration
  const updateRegistration = useCallback(
    async (
      registration: RegistrationFormData
    ): Promise<RegistrationFormData> => {
      const url = `${COMMON_ADMIN_API}/registrations/update`;

      const response = await apiFetch(url, {
        method: "PUT",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registration),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update registration.");
      }

      const data = await response.json();
      return data; // Adjust based on actual response structure
    },
    [apiFetch]
  );

  // 5. Delete a registration
  const deleteRegistration = useCallback(
    async (termId: string, registrationId: string): Promise<void> => {
      const url = `${COMMON_ADMIN_API}/registrations/${termId}/${registrationId}`;

      const response = await apiFetch(url, {
        method: "DELETE",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete registration.");
      }

      // Assuming no content is returned on successful delete
    },
    [apiFetch]
  );

  // 6. Get registration by ID
  const getRegistrationById = useCallback(
    async (id: string, termId: string): Promise<RegistrationFormData> => {
      const url = `${COMMON_ADMIN_API}/registrations/${id}`;

      const response = await apiFetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch registration by ID."
        );
      }

      const data = await response.json();
      return data; // Adjust based on actual response structure
    },
    [apiFetch]
  );

  return {
    getRegistrations,
    deleteRegistration,
    createRegistration,
    updateRegistration,
    getRegistrationOptions,
    getRegistrationById,
  };
};

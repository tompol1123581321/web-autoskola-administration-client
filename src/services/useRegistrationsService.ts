// src/services/useRegistrationsService.ts

import { useCallback } from "react";
import {
  RegistrationFormData,
  TermOption, // Assuming this is the type returned by /options
} from "autoskola-web-shared-models";
import useApi from "../hooks/api/useApi";
import { COMMON_ADMIN_API } from "../constants/api";

export type RegistrationSearchParams = {
  dataFilterParams: {
    termId?: string;
    userSearch?: string;
    registrationDate?: { from?: string; to?: string };
  };
  sortParams: { key: string; direction: "ASC" | "DESC" };
  paginationsParams: { page: number; pageSize: number };
};

export type AdminRegistration = RegistrationFormData & {
  adminNote?: string;
};

export type RegistrationSearchResponse = {
  data: AdminRegistration[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

interface RegistrationService {
  getRegistrations: (
    filter: RegistrationSearchParams
  ) => Promise<RegistrationSearchResponse>;
  deleteRegistration: (registrationId: string) => Promise<void>;
  createRegistration: (
    registration: Omit<RegistrationFormData, "id">
  ) => Promise<RegistrationFormData>;
  updateRegistration: (
    registration: AdminRegistration
  ) => Promise<AdminRegistration>;
  getRegistrationOptions: () => Promise<TermOption[]>;
  getRegistrationById: (
    id: string,
    termId: string
  ) => Promise<AdminRegistration>;
}

export const useRegistrationsService = (): RegistrationService => {
  const apiFetch = useApi();

  // 1. Create a new registration
  const createRegistration = useCallback(
    async (
      registration: Omit<RegistrationFormData, "id">
    ): Promise<RegistrationFormData> => {
      const url = `${COMMON_ADMIN_API}/registrations`;

      const response = await apiFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registration),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registraci se nepodařilo vytvořit.");
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
        errorData.error || "Nepodařilo se načíst volby termínů."
      );
    }

    const data = await response.json();
    return data; // Adjust based on actual response structure
  }, [apiFetch]);

  // 3. Get registrations with filters
  const getRegistrations = useCallback(
    async (filter: RegistrationSearchParams): Promise<RegistrationSearchResponse> => {
      const url = `${COMMON_ADMIN_API}/registrations/search`;

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
        throw new Error(errorData.error || "Nepodařilo se načíst registrace.");
      }

      const data = await response.json();
      return data;
    },
    [apiFetch]
  );

  // 4. Update a registration
  const updateRegistration = useCallback(
    async (
      registration: AdminRegistration
    ): Promise<AdminRegistration> => {
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
        throw new Error(errorData.error || "Registraci se nepodařilo upravit.");
      }

      const data = await response.json();
      return data; // Adjust based on actual response structure
    },
    [apiFetch]
  );

  // 5. Delete a registration
  const deleteRegistration = useCallback(
    async (registrationId: string): Promise<void> => {
      const url = `${COMMON_ADMIN_API}/registrations/${registrationId}`;

      const response = await apiFetch(url, {
        method: "DELETE",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registraci se nepodařilo smazat.");
      }

      // Assuming no content is returned on successful delete
    },
    [apiFetch]
  );

  // 6. Get registration by ID
  const getRegistrationById = useCallback(
    async (id: string, termId: string): Promise<AdminRegistration> => {
      const url = `${COMMON_ADMIN_API}/registrations/${id}/${termId}`;

      const response = await apiFetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Nepodařilo se načíst detail registrace."
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

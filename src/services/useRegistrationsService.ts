// hooks/services/useRegistrationService.ts

import { useCallback } from "react";
import {
  RegistrationFormData,
  RegistrationsFilter,
} from "autoskola-web-shared-models";
import { COMMON_ADMIN_API } from "../constants/api";
import useApi from "../hooks/api/useApi";

interface RegistrationService {
  getRegistrations: (
    filter: RegistrationsFilter
  ) => Promise<RegistrationFormData[]>;
  deleteRegistration: (registrationId: string) => Promise<void>;
  createRegistration: (
    registration: Omit<RegistrationFormData, "id">
  ) => Promise<RegistrationFormData>;
  updateRegistration: (
    registration: RegistrationFormData
  ) => Promise<RegistrationFormData>;
}

export const useRegistrationsService = (): RegistrationService => {
  const apiFetch = useApi();

  const getRegistrations = useCallback(
    async (filter: RegistrationsFilter): Promise<RegistrationFormData[]> => {
      const url = new URL(`${COMMON_ADMIN_API}/registrations`);
      Object.keys(filter).forEach((key) => {
        if (filter[key as keyof RegistrationsFilter] !== undefined) {
          url.searchParams.append(
            key,
            String(filter[key as keyof RegistrationsFilter])
          );
        }
      });

      const response = await apiFetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch registrations.");
      }

      const data = await response.json();
      return data.registrations;
    },
    [apiFetch]
  );

  const deleteRegistration = useCallback(
    async (registrationId: string): Promise<void> => {
      const url = `${COMMON_ADMIN_API}/registrations/${registrationId}`;

      const response = await apiFetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete registration.");
      }
    },
    [apiFetch]
  );

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
        throw new Error(errorData.error || "Failed to create registration.");
      }

      const data = await response.json();
      return data.registration;
    },
    [apiFetch]
  );

  const updateRegistration = useCallback(
    async (
      registration: RegistrationFormData
    ): Promise<RegistrationFormData> => {
      const url = `${COMMON_ADMIN_API}/registrations/${registration.id}`;

      const response = await apiFetch(url, {
        method: "PUT",
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
      return data.registration;
    },
    [apiFetch]
  );

  return {
    getRegistrations,
    deleteRegistration,
    createRegistration,
    updateRegistration,
  };
};

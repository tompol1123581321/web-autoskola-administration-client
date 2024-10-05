import {
  RegistrationFormData,
  RegistrationsFilter,
} from "autoskola-web-shared-models";
import { COMMON_ADMIN_API } from "../constants/api";

export const getRegistrations = async (
  jwtToken: string,
  filter: RegistrationsFilter
) => {
  const {} = fetch(`${COMMON_ADMIN_API}`);
};

export const deleteRegistration = async (
  jwtToken: string,
  registration: RegistrationFormData
) => {
  const {} = fetch(`${COMMON_ADMIN_API}`);
};
export const createRegistration = async (
  jwtToken: string,
  registration: Omit<RegistrationFormData, "id">
) => {
  const {} = fetch(`${COMMON_ADMIN_API}`);
};
export const updateRegistration = async (
  jwtToken: string,
  registration: RegistrationFormData
) => {
  const {} = fetch(`${COMMON_ADMIN_API}`);
};

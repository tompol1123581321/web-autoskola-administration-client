import { useCallback } from "react";
import { COMMON_ADMIN_API } from "../constants/api";
import useApi from "../hooks/api/useApi";
import { TermFilter, Term } from "autoskola-web-shared-models";

interface TermsService {
  getTerms: (filter: TermFilter) => Promise<Term[]>;
  getTermById: (id: string) => Promise<Term>;
  addTerm: (
    term: Omit<Term, "id" | "registrations" | "created">
  ) => Promise<Term>;
  updateTerm: (term: Term) => Promise<Term>;
  deleteTerm: (id: string) => Promise<void>;
}

export const useTermsService = (): TermsService => {
  const apiFetch = useApi();

  const getTerms = useCallback(
    async (filter: TermFilter): Promise<Term[]> => {
      const url = new URL(`${COMMON_ADMIN_API}/terms`);
      Object.keys(filter).forEach((key) => {
        const filterKey = key as keyof TermFilter;
        const value = filter[filterKey];
        if (value !== undefined && value !== null) {
          if (typeof value === "object" && value !== null) {
            Object.keys(value).forEach((subKey) => {
              const subValue = (value as any)[subKey];
              if (subValue) {
                url.searchParams.append(`${key}.${subKey}`, subValue);
              }
            });
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });

      const response = await apiFetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch terms.");
      }

      const data = await response.json();
      return data.terms;
    },
    [apiFetch]
  );

  const getTermById = useCallback(
    async (id: string): Promise<Term> => {
      const url = `${COMMON_ADMIN_API}/terms/${id}`;

      const response = await apiFetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch term.");
      }

      const data = await response.json();
      return data.term;
    },
    [apiFetch]
  );

  const addTerm = useCallback(
    async (
      term: Omit<Term, "id" | "registrations" | "created">
    ): Promise<Term> => {
      const url = `${COMMON_ADMIN_API}/terms`;

      const response = await apiFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(term),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add term.");
      }

      const data = await response.json();
      return data.term;
    },
    [apiFetch]
  );

  const updateTerm = useCallback(
    async (term: Term): Promise<Term> => {
      const url = `${COMMON_ADMIN_API}/terms/${term.id}`;

      const response = await apiFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(term),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update term.");
      }

      const data = await response.json();
      return data.term;
    },
    [apiFetch]
  );

  const deleteTerm = useCallback(
    async (id: string): Promise<void> => {
      const url = `${COMMON_ADMIN_API}/terms/${id}`;

      const response = await apiFetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete term.");
      }
    },
    [apiFetch]
  );

  return {
    getTerms,
    getTermById,
    addTerm,
    updateTerm,
    deleteTerm,
  };
};

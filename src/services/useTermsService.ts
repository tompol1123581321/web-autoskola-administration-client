import { useCallback } from "react";
import { COMMON_ADMIN_API } from "../constants/api";
import useApi from "../hooks/api/useApi";
import { TermFilter, Term } from "autoskola-web-shared-models";

interface TermsService {
  getTerms: (filter: TermFilter) => Promise<Term[]>;
  addTerm: (
    term: Omit<Term, "id" | "registrations" | "created">
  ) => Promise<Term>;
  updateTerm: (term: Term) => Promise<Term>;
  deleteTerm: (id: string) => Promise<void>;
  getTermById: (id: string) => Promise<Term>;
}

export const useTermsService = (): TermsService => {
  const apiFetch = useApi();

  // 1. Get all terms (protected)
  const getTerms = useCallback(
    async (filter: TermFilter = {}): Promise<Term[]> => {
      const url = `${COMMON_ADMIN_API}/terms`;

      const response = await apiFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch terms.");
      }

      const data = await response.json();
      return data; // Changed from data.terms
    },
    [apiFetch]
  );

  // 2. Add a new term (protected)
  const addTerm = useCallback(
    async (
      term: Omit<Term, "id" | "registrations" | "created">
    ): Promise<Term> => {
      const url = `${COMMON_ADMIN_API}/terms/add`;

      const response = await apiFetch(url, {
        credentials: "include",
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
      return data; // Changed from data.term
    },
    [apiFetch]
  );

  // 3. Update the term (protected)
  const updateTerm = useCallback(
    async (term: Term): Promise<Term> => {
      const url = `${COMMON_ADMIN_API}/terms/update`;

      const response = await apiFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(term),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update term.");
      }

      const data = await response.json();
      return data; // Changed from data.term
    },
    [apiFetch]
  );

  // 4. Delete the term (protected)
  const deleteTerm = useCallback(
    async (id: string): Promise<void> => {
      const url = `${COMMON_ADMIN_API}/terms/${id}`;

      const response = await apiFetch(url, {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete term.");
      }

      // No need to return anything
    },
    [apiFetch]
  );

  // 5. Get term by ID (protected)
  const getTermById = useCallback(
    async (id: string): Promise<Term> => {
      const url = `${COMMON_ADMIN_API}/terms/${id}`;

      const response = await apiFetch(url, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get term.");
      }
      return await response.json();
    },
    [apiFetch]
  );

  return {
    getTerms,
    addTerm,
    updateTerm,
    deleteTerm,
    getTermById,
  };
};

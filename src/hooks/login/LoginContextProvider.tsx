// context/LoginContextProvider.tsx

import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { getAdminSession } from "../../services/loginService";

export type AuthUser = { name: string; email?: string; exp?: number };

type LoginContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  sessionError: string;
  setUser: (user: AuthUser | null) => void;
  clearAuth: () => void;
  retrySession: () => Promise<void>;
};

const DEFAULT_CONTEXT_VALUE: LoginContextType = {
  user: null,
  isAuthenticated: false,
  isLoadingSession: true,
  sessionError: "",
  setUser: () => {},
  clearAuth: () => {},
  retrySession: async () => {},
};

export const LoginContext = createContext<LoginContextType>(
  DEFAULT_CONTEXT_VALUE
);

export const LoginContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  const retrySession = useCallback(async () => {
    setIsLoadingSession(true);
    setSessionError("");
    try {
      const session = await getAdminSession();
      setUser(session.isAuthorized && session.user ? session.user : null);
    } catch (error) {
      setSessionError(error instanceof Error ? error.message : "Nelze ověřit přihlášení.");
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  useEffect(() => {
    retrySession();
  }, [retrySession]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isLoadingSession, sessionError, setUser, clearAuth, retrySession }),
    [user, isLoadingSession, sessionError, clearAuth, retrySession]
  );

  return (
    <LoginContext.Provider
      value={value}
    >
      {children}
    </LoginContext.Provider>
  );
};

// context/LoginContextProvider.tsx

import React, { createContext, PropsWithChildren, useState } from "react";

type LoginContextType = {
  update: (newContext: LoginContextType["value"]) => void;
  value: { isLoggedIn: boolean; userName?: string };
  logout: () => void;
};

const DEFAULT_CONTEXT_VALUE: LoginContextType = {
  update: () => {},
  value: { isLoggedIn: false },
  logout: () => {},
};

export const LoginContext = createContext<LoginContextType>(
  DEFAULT_CONTEXT_VALUE
);

export const LoginContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [contextValue, setContextValue] = useState(DEFAULT_CONTEXT_VALUE.value);

  const logout = () => {
    setContextValue({ isLoggedIn: false, userName: undefined });
    // Optionally, you can perform additional actions here, such as clearing local storage
  };

  return (
    <LoginContext.Provider
      value={{ value: contextValue, update: setContextValue, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

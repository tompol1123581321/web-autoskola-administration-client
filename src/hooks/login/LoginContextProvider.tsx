import { createContext, PropsWithChildren, useState } from "react";

type LoginContextType = {
  update: (newContext: LoginContextType["value"]) => void;
  value: { jwt?: string; isLoggedIn: boolean };
};
const DEFAULT_CONTEXT_VALUE: LoginContextType = {
  update: () => {},
  value: { isLoggedIn: true },
};

export const LoginContext = createContext<LoginContextType>(
  DEFAULT_CONTEXT_VALUE
);

export const LoginContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [contextValue, setContextValue] = useState(DEFAULT_CONTEXT_VALUE.value);

  return (
    <LoginContext.Provider
      value={{ value: contextValue, update: setContextValue }}
    >
      {children}
    </LoginContext.Provider>
  );
};

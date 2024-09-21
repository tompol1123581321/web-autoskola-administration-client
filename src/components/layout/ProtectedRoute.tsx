import { PropsWithChildren, useEffect } from "react";
import { useLogin } from "../../hooks/login/useLogin";

export const ProtectedAppRoute: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { isLoggedIn, logout } = useLogin();

  useEffect(() => {
    if (!isLoggedIn) {
      logout();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return children;
};

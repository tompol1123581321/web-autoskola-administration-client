import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoginContext } from "../../hooks/login/LoginContextProvider";

export const ProtectedRoute: React.FC = () => {
  const {
    value: { isLoggedIn },
  } = useContext(LoginContext);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

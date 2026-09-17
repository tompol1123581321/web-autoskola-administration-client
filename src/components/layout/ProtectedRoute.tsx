import React, { useContext } from "react";
import { Spin } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import { LoginContext } from "../../hooks/login/LoginContextProvider";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoadingSession } = useContext(LoginContext);

  if (isLoadingSession) {
    return <div className="min-h-screen flex items-center justify-center"><Spin tip="Ověřování přihlášení..." size="large" /></div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

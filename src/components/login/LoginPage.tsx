// components/login/LoginPage.tsx

import React, { useCallback, useState } from "react";
import { Layout, Typography, Button, Input, Space, Alert, Spin } from "antd";
import { Administrator } from "autoskola-web-shared-models";
import { useLogin } from "../../hooks/login/useLogin";

const { Content } = Layout;

export const LoginPage: React.FC = () => {
  // Local state to manage form inputs
  const [loginFormState, setLoginFormState] = useState<
    Omit<Administrator, "email">
  >({
    userName: "",
    password: "",
  });

  // Local state to manage loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Destructure the login function from the useLogin hook
  const { login } = useLogin();

  // Handle input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setLoginFormState((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  // Handle form submission
  const handleLogin = useCallback(async () => {
    setLoading(true); // Start loading
    setError(""); // Reset previous errors

    try {
      await login(loginFormState); // Attempt to log in
      // On successful login, useLogin hook handles navigation
    } catch (err: any) {
      // Handle errors (e.g., invalid credentials)
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  }, [login, loginFormState]);

  return (
    <Layout
      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      className="min-h-screen"
    >
      <Typography.Title className="mt-5 text-lg text-center">
        Autoškola Hlaváček (Administrační obrazovka)
      </Typography.Title>

      <Content className="flex justify-center items-center w-screen">
        <div className="p-5 sm:p-10 lg:p-15 border w-full sm:w-10/12 md:w-8/12 lg:w-5/12">
          <Space size="large" direction="vertical" className="w-full">
            <Typography.Title level={5} className="text-lg text-center">
              Přihlášení do administrace
            </Typography.Title>

            {/* Display error message if any */}
            {error && (
              <Alert
                message="Chyba"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError("")}
              />
            )}

            {/* Username Input */}
            <Typography.Title level={5}>Uživatelské jméno</Typography.Title>
            <Input
              onChange={handleChange}
              name="userName"
              value={loginFormState.userName}
              size="large"
              placeholder="Uživatelské jméno"
              autoComplete="username"
            />

            {/* Password Input */}
            <Typography.Title level={5}>Heslo</Typography.Title>
            <Input.Password
              onChange={handleChange}
              name="password"
              value={loginFormState.password}
              size="large"
              placeholder="Heslo"
              autoComplete="current-password"
            />

            {/* Login Button */}
            <Button
              type="dashed"
              size="large"
              block
              onClick={handleLogin}
              disabled={
                !loginFormState.userName || !loginFormState.password || loading
              }
            >
              {loading ? <Spin /> : "Přihlásit"}
            </Button>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

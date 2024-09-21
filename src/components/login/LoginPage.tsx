import { Layout, Typography, Button, Input, Space } from "antd";
import { Administrator } from "autoskola-web-shared-models";
import { useCallback, useState } from "react";
import { useLogin } from "../../hooks/login/useLogin";

export const LoginPage = () => {
  const [loginFormState, setLoginFormState] = useState<
    Omit<Administrator, "email">
  >({ password: "", userName: "" });

  const { login } = useLogin();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setLoginFormState((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleLogin = useCallback(() => {
    login(loginFormState);
  }, [loginFormState, login]);

  return (
    <Layout className="min-h-screen">
      <Typography.Title className="mt-5 text-lg text-center">
        Autoškola Hlaváček (Administrační obrazovka)
      </Typography.Title>

      <Layout.Content className="flex justify-center items-center w-screen">
        <div className="p-5 sm:p-10 lg:p-15 border w-full sm:w-10/12 md:w-8/12 lg:w-5/12">
          <Space size={"large"} className="w-full" direction="vertical">
            <Typography.Title level={5} className=" text-lg text-center">
              Přihlášení do administrace
            </Typography.Title>
            <Typography.Title level={5}>Uživatelské jméno</Typography.Title>
            <Input
              onChange={handleChange}
              name="userName"
              value={loginFormState.userName}
              size="large"
              placeholder="Uživatelské jméno"
            />
            <Typography.Title level={5}>Heslo</Typography.Title>
            <Input
              onChange={handleChange}
              name="password"
              value={loginFormState.password}
              size="large"
              type="password"
              placeholder="Heslo"
            />
            <Button
              disabled={!loginFormState.userName || !loginFormState.password}
              block
              onClick={handleLogin}
            >
              Přihlásit
            </Button>
          </Space>
        </div>
      </Layout.Content>
    </Layout>
  );
};

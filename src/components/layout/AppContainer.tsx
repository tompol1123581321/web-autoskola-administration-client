import React from "react";

import { NavigationComponent } from "./Navigation";
import { Button, Layout, Typography } from "antd";
import { LockFilled } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useLogin } from "../../hooks/login/useLogin";

const { Content, Header } = Layout;

export const AppContainer: React.FC = () => {
  const { logout } = useLogin();
  return (
    <Layout className="min-h-screen">
      <div className="flex justify-between items-center w-11/12 m-auto">
        <Typography.Paragraph className="mt-5 text-lg">
          Autoškola Hlaváček (Administrační obrazovka)
        </Typography.Paragraph>

        <Button onClick={logout} className="m-2">
          <LockFilled className="mr-2" />
          Odhlásit
        </Button>
      </div>

      <Header>
        <NavigationComponent />
      </Header>
      <Content>
        <div>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

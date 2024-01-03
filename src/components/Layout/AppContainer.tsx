import React from "react";

import { Layout, theme } from "antd";
import { NavigationComponent } from "./Navigation";

const { Content, Footer } = Layout;

export const AppContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <NavigationComponent />
      <Content className="site-layout">
        <div
          style={{ padding: 24, minHeight: 380, background: colorBgContainer }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
};

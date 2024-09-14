import { Layout, Typography, Button, Input, Space } from "antd";

export const LoginPage = () => {
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
            <Input size="large" placeholder="Uživatelské jméno" />
            <Typography.Title level={5}>Heslo</Typography.Title>
            <Input size="large" type="password" placeholder="Heslo" />
            <Button block onClick={console.log}>
              Přihlásit
            </Button>
          </Space>
        </div>
      </Layout.Content>
    </Layout>
  );
};

import Menu from "antd/es/menu/menu";
import { MENU_ITEMS } from "../../utils/navigationUtils";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const NavigationComponent = () => {
  const { pathname } = useLocation();

  const defaultSelectedKey = useMemo(() => {
    return [
      pathname === "/app" ? "registrations-overview" : pathname.substring(5),
    ];
  }, []);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      items={MENU_ITEMS}
      defaultSelectedKeys={defaultSelectedKey}
    />
  );
};

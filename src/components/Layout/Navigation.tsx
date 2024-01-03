import { Header } from "antd/es/layout/layout";
import Menu from "antd/es/menu/menu";
import {
  MENU_ITEMS,
  getActiveTabNameFromURL,
} from "../../utils/navigationUtils";

export const NavigationComponent = () => {
  const activeTabs = getActiveTabNameFromURL();
  console.log(activeTabs);
  return (
    <Header className="sticky top-0 z-10 flex">
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={activeTabs}
        items={MENU_ITEMS}
      />
    </Header>
  );
};

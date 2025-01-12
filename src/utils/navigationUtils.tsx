import { ItemType } from "antd/es/menu/interface";
import { Link } from "react-router-dom";

export const MENU_ITEMS: Array<ItemType> = [
  {
    key: "registrations-overview",
    label: <Link to={"/app"}>Přehled registrací</Link>,
  },
  {
    key: "terms-overview",
    label: <Link to={"/app/terms"}>Přehled termínů</Link>,
  },
  {
    key: "public-web-settings",
    label: (
      <Link to={"/app/public-web-settings"}>Nastavení veřejného webu</Link>
    ),
  },
  {
    key: "changes-audit",
    label: <Link to={"/app/changes-audit"}>Přehled změn</Link>,
  },
];

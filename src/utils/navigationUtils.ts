import { ItemType } from "antd/es/menu/hooks/useItems";

type NavTabName = {
  key: string;
  label: string;
  children?: Array<Omit<NavTabName, "children">>;
  onClick: (newActiveTabName: string) => void;
};

export const NAV_TAB_NAMES = [
  "overview",
  "pageConfiguration-home",
  "pageConfiguration-price_list",
  "pageConfiguration-contacts",
  "pageConfiguration-registration",
  "pageConfiguration-for_students",
  "terms",
  "terms-overview",
  "terms-settings",
  "files",
  "files-images",
  "files-docs",
];

export const getActiveTabNameFromURL = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("activeTab")) {
    const activeTabValue = urlParams.get("activeTab");
    return activeTabValue
      ? NAV_TAB_NAMES.filter((name) => {
          return (
            name.includes(activeTabValue.split("-")[0]) ||
            name.includes(activeTabValue)
          );
        })
      : ["overview"];
  }
  return ["overview"];
};

export const setNewActiveTabToUrl = (newActiveTabName: string) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (!urlParams.has("activeTab")) {
    console.log("test", newActiveTabName);
    urlParams.append("activeTab", newActiveTabName);
  } else {
    urlParams.set("activeTab", newActiveTabName);
  }
};

export const MENU_ITEMS: Array<ItemType> = [
  {
    key: "overview",
    label: "Přehled",
    onClick: () => setNewActiveTabToUrl("overview"),
  },
  {
    key: "pageConfiguration",
    label: "Nastavení stránek",

    children: [
      {
        key: "pageConfiguration-home",
        label: "O nás",
        onClick: () => setNewActiveTabToUrl("pageConfiguration-home"),
      },
      {
        key: "pageConfiguration-price_list",
        label: "Ceník",
        onClick: () => setNewActiveTabToUrl("pageConfiguration-price_list"),
      },
      {
        key: "pageConfiguration-contacts",
        label: "Kontakty",
        onClick: () => setNewActiveTabToUrl("pageConfiguration-contacts"),
      },
      {
        key: "pageConfiguration-for_students",
        label: "Pro studenty",
        onClick: () => setNewActiveTabToUrl("pageConfiguration-for_students"),
      },
      {
        key: "pageConfiguration-registration",
        label: "Registrace",
        onClick: () => setNewActiveTabToUrl("pageConfiguration-registration"),
      },
    ],
  },
  {
    key: "terms",
    label: "Termíny",
    children: [
      {
        key: "terms-overview",
        label: "Přehled termínů",
        onClick: () => setNewActiveTabToUrl("terms-overview"),
      },
      {
        key: "terms-settings",
        label: "Nastavení termínů",
        onClick: () => setNewActiveTabToUrl("terms-settings"),
      },
    ],
  },
  {
    key: "files",
    label: "Soubory",
    children: [
      {
        key: "files-images",
        label: "Obrázky",
        onClick: () => setNewActiveTabToUrl("files-images"),
      },
      {
        key: "files-docs",
        label: "Dokumenty",
        onClick: () => setNewActiveTabToUrl("files-docs"),
      },
    ],
  },
];

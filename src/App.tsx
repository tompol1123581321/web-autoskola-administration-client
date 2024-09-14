import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContainer } from "./components/layout/AppContainer";
import { LoginPage } from "./components/login/LoginPage";
import { RegistrationsOverview } from "./components/body/registrations-overview/RegistrationsOverview";
import { PublicWebSettings } from "./components/body/public-web-settings/PublicWebSettings";
import { ChangesAudit } from "./components/body/changes-audit/ChangesAudit";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={LoginPage} />
        <Route path="/app" Component={AppContainer}>
          <Route path="" Component={RegistrationsOverview} />
          <Route path="public-web-settings" Component={PublicWebSettings} />
          <Route path="changes-audit" Component={ChangesAudit} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

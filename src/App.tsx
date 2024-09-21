import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContainer } from "./components/layout/AppContainer";
import { LoginPage } from "./components/login/LoginPage";
import { RegistrationsOverview } from "./components/body/registrations-overview/RegistrationsOverview";
import { PublicWebSettings } from "./components/body/public-web-settings/PublicWebSettings";
import { ChangesAudit } from "./components/body/changes-audit/ChangesAudit";
import { LoginContextProvider } from "./hooks/login/LoginContextProvider";
import { ProtectedAppRoute } from "./components/layout/ProtectedRoute";

export const App = () => {
  return (
    <LoginContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={LoginPage} />
          <Route
            path="/app"
            Component={() => (
              <ProtectedAppRoute>
                <AppContainer />
              </ProtectedAppRoute>
            )}
          >
            <Route path="" Component={RegistrationsOverview} />
            <Route path="public-web-settings" Component={PublicWebSettings} />
            <Route path="changes-audit" Component={ChangesAudit} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoginContextProvider>
  );
};

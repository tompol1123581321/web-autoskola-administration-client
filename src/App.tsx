import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AppContainer } from "./components/layout/AppContainer";
import { LoginPage } from "./components/login/LoginPage";
import { RegistrationsOverview } from "./components/body/registrations-overview/overview/RegistrationsOverview";
import { PublicWebSettings } from "./components/body/public-web-settings/PublicWebSettings";
import { ChangesAudit } from "./components/body/changes-audit/ChangesAudit";
import { LoginContextProvider } from "./hooks/login/LoginContextProvider";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { RegistrationDetail } from "./components/body/registrations-overview/detail/RegistrationDetail";
import { TermsOverview } from "./components/body/term-overview/overview/TermsOverview";
import { TermDetail } from "./components/body/term-overview/detail/TermDetail";

export const App = () => {
  return (
    <LoginContextProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppContainer />}>
              <Route index element={<RegistrationsOverview />} />
              <Route
                path="registration-detail/:id"
                element={<RegistrationDetail />}
              />
              <Route path="terms" element={<TermsOverview />} />
              <Route path="terms/term-detail/:id" element={<TermDetail />} />
              <Route
                path="public-web-settings"
                element={<PublicWebSettings />}
              />
              <Route path="changes-audit" element={<ChangesAudit />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LoginContextProvider>
  );
};

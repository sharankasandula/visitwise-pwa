import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import ThemeProvider from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import AddOrEditPatient from "./components/AddOrEditPatient";
import PatientProfile from "./components/PatientProfile";
import EarningsSummary from "./components/EarningsSummary";
import ArchivedPatients from "./components/ArchivedPatients";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";
import MediaManagementPage from "./components/MediaManagementPage";
import Toast from "./components/ui/Toast";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="app-container">
                      <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route
                            path="/add-patient"
                            element={<AddOrEditPatient />}
                          />
                          <Route
                            path="/edit-patient/:patientId"
                            element={<AddOrEditPatient />}
                          />
                          <Route
                            path="/patient/:id"
                            element={<PatientProfile />}
                          />
                          <Route
                            path="/patient/:id/media"
                            element={<PatientProfile />}
                          />
                          <Route
                            path="/archived-patients"
                            element={<ArchivedPatients />}
                          />
                          <Route
                            path="/earnings"
                            element={<EarningsSummary />}
                          />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route
                            path="/media"
                            element={<MediaManagementPage />}
                          />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toast />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

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
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <ProtectedRoute>
              <div className="app-container">
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add-patient" element={<AddOrEditPatient />} />
                    <Route
                      path="/edit-patient/:patientId"
                      element={<AddOrEditPatient />}
                    />
                    <Route path="/patient/:id" element={<PatientProfile />} />
                    <Route
                      path="/archived-patients"
                      element={<ArchivedPatients />}
                    />
                    <Route path="/earnings" element={<EarningsSummary />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

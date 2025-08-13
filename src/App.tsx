import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Home from "./components/Home";
import AddOrEditPatient from "./components/AddOrEditPatient";
import PatientProfile from "./components/PatientProfile";
import EarningsSummary from "./components/EarningsSummary";
import "./App.css";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/add-patient" element={<AddOrEditPatient />} />
            <Route
              path="/edit-patient/:patientId"
              element={<AddOrEditPatient />}
            />
            <Route path="/patient/:id" element={<PatientProfile />} />
            <Route path="/earnings" element={<EarningsSummary />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

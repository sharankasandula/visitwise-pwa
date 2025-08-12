// Example: HomePage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../store/slices/patientsSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { patients, loading, error } = useSelector(
    (state: any) => state.patients
  );

  useEffect(() => {
    dispatch(fetchPatients());
    // Fetch patients when the component mounts
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Patients</h2>
      <ul>
        {patients.map((patient: any) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;

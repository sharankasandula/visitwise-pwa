import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Archive, ArrowLeft, User } from "lucide-react";
import PatientCard from "./PatientCard";
import { useNavigate } from "react-router-dom";
import { fetchPatients, searchPatients } from "../store/slices/patientsSlice";

const ArchivedPatients: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );

  useEffect(() => {
    dispatch(fetchPatients() as any);
  }, [dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      dispatch(fetchPatients() as any);
    } else {
      dispatch(searchPatients(term) as any);
    }
  };

  const archivedPatients = patients.filter((p) => !p.isActive);
  const filteredArchivedPatients =
    searchTerm.trim() === ""
      ? archivedPatients
      : archivedPatients.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">
          Loading archived patients...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-primary/90 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Archived Patients</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search archived patients by name..."
          className="w-full p-3 rounded-lg shadow-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Archived Patients List */}
      <div className="px-4 pb-4 space-y-3">
        {filteredArchivedPatients.map((patient, index) => (
          <div
            key={patient.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PatientCard patient={patient} />
          </div>
        ))}

        {filteredArchivedPatients.length === 0 && (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {searchTerm.trim() === ""
                ? "No archived patients"
                : "No patients found"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm.trim() === ""
                ? "Patients you archive will appear here"
                : "Try adjusting your search terms"}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {archivedPatients.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total archived patients:{" "}
              <span className="font-semibold">{archivedPatients.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedPatients;

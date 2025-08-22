import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Archive, ArrowLeft, Search, User } from "lucide-react";
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
        <div className="text-center text-muted-foreground">
          Loading archived patients...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate("/")} className="p-2 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">
                Archived Patients ({archivedPatients.length})
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search (Archived) */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 px-4 py-4">
        <label htmlFor="archived-search" className="sr-only">
          Search archived patients
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <input
            id="archived-search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search archived patients by name..."
            className="h-11 w-full rounded-lg shadow-md border border-border
                 bg-background pl-11 pr-3
                 text-foreground placeholder:text-muted-foreground
                 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
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
    </div>
  );
};

export default ArchivedPatients;

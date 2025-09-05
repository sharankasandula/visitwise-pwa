import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Archive, ArrowLeft, Search, User } from "lucide-react";
import PatientCard from "./PatientCard";
import { useNavigate } from "react-router-dom";
import { fetchPatients, searchPatients } from "../store/slices/patientsSlice";
import { PullToRefresh } from "./ui/PullToRefresh";

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

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    try {
      await dispatch(fetchPatients() as any);
    } catch (error) {
      console.error("Failed to refresh archived patients:", error);
    }
  }, [dispatch]);

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

      {/* Main content with pull-to-refresh */}
      <PullToRefresh onRefresh={handleRefresh}>
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
              className="h-11 w-full rounded-lg shadow-md 
                   bg-accent/20 pl-11 pr-3
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
            <div className="flex flex-col items-center text-center py-6">
              {/* <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" /> */}
              <img
                src="./illustrations/physio_illustration4.png"
                alt="Physiotherapist Illustration"
                className="w-24 h-auto my-6"
              />
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
      </PullToRefresh>
    </div>
  );
};

export default ArchivedPatients;

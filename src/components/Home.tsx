import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  Plus,
  Archive,
  User,
  Moon,
  Sun,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import PatientCard from "./PatientCard";
import { useNavigate } from "react-router-dom";
import { fetchPatients, searchPatients } from "../store/slices/patientsSlice";
import UserProfile from "./UserProfile";
import EarningsCard from "./EarningsCard";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { mode } = useSelector((state: RootState) => state.theme);

  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );
  const navigate = useNavigate();

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

  const activePatients = patients.filter((p) => p.isActive);
  const archivedPatients = patients.filter((p) => !p.isActive);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-2 ">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-pacifico brand-heading">Visitwise</h1>
          </div>
          <div className="flex items-center gap-2"></div>
          <UserProfile />
        </div>
      </div>

      <div className="sticky  px-4 space-y-3">
        <EarningsCard />
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 px-4 pb-2 pt-4">
        <label htmlFor="active-search" className="sr-only">
          Search patients
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search
              className="h-6 w-6 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <input
            id="active-search"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search patients by name..."
            className="h-11 w-full rounded-full bg-muted pl-11 pr-3
                 text-foreground placeholder:text-muted-foreground
                 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search patients"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-4 py-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground text-lg">Loading patients...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="px-4 py-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-destructive">
                  Error loading patients
                </h3>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(fetchPatients() as any)}
              className="mt-3 text-sm text-destructive hover:text-destructive/80 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Patient List - Only show when not loading and no error */}
      {!loading && !error && (
        <div className="px-4 pb-4 text-muted space-y-3">
          {/* Archived Patients Card */}
          {archivedPatients.length > 0 && (
            <div
              className="animate-slide-up pl-1"
              style={{ animationDelay: `${activePatients.length * 0.1}s` }}
            >
              <div
                onClick={() => navigate("/archived-patients")}
                className="rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <Archive className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="">
                        Archived Patients ({archivedPatients.length})
                      </h3>
                    </div>
                  </div>
                  <div className="">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePatients.map((patient, index) => (
            <div
              key={patient.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PatientCard patient={patient} />
            </div>
          ))}

          {activePatients.length === 0 && (
            <div className="text-center py-12">
              <Archive className="w-12 text-muted-foreground h-12 mx-auto mb-4" />
              <p className="mb-6 text-muted-foreground">No active patients</p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/add-patient")}
                  className="w-full max-w-xs py-3 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Patient
                </button>

                <p className="text-muted-foreground"> or </p>

                <button
                  onClick={() => {
                    // TODO: Implement contact import functionality
                    alert("Contact import feature coming soon!");
                  }}
                  className="w-full max-w-xs bg-muted text-muted-foreground py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors font-medium flex items-center justify-center gap-2 mx-auto border border-border"
                >
                  <User className="w-5 h-5" />
                  Import from Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/add-patient")}
        className="fixed bottom-6 bg-primary right-6  p-4 rounded-full shadow-lg  transition-colors animate-bounce-in"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Plus, Archive, User, Moon, Sun, Search } from "lucide-react";
import PatientCard from "./PatientCard";
import EarningsCard from "./EarningsCard";
import { useNavigate } from "react-router-dom";
import { fetchPatients, searchPatients } from "../store/slices/patientsSlice";
import UserProfile from "./UserProfile";
import { setThemeMode } from "../store/slices/themeSlice";

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

      {/* <div className="sticky  px-4 space-y-3">
        <EarningsCard />
      </div> */}

      {/* Sticky Search Bar */}
      <div className="sticky top-12 z-10 px-4 pb-2 pt-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search patients by name..."
            className="w-full rounded-full bg-muted pl-9 pr-3 py-2 mb-2
                 text-foreground placeholder:text-muted-foreground
                 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search patients"
          />
        </div>
      </div>

      {/* Patient List */}
      <div className="px-4 pb-4 text-muted space-y-3">
        {/* Archived Patients Card */}
        {archivedPatients.length > 0 && (
          <div
            className="animate-slide-up"
            style={{ animationDelay: `${activePatients.length * 0.1}s` }}
          >
            <div
              onClick={() => navigate("/archived-patients")}
              className="rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <Archive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3>Archived Patients ({archivedPatients.length})</h3>
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
            <Archive className="w-12 text-muted-foreground text-gray-400 h-12 mx-auto mb-4" />
            <p className="mb-6 text-muted-foreground text-gray-400 ">
              No active patients
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/add-patient")}
                className="w-full max-w-xs border  py-3  px-6 rounded-lg bg-primary hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Patient
              </button>

              <p className="text-muted "> or </p>

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

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/add-patient")}
        className="fixed bottom-6 bg-primary right-6 bg-primary-600  p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors animate-bounce-in"
      >
        <Plus className="w-6 h-6 " />
      </button>
    </div>
  );
};

export default Home;

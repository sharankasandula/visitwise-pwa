import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Plus, Archive, Navigation, Phone, User } from "lucide-react";
import PatientCard from "./PatientCard";
import EarningsCard from "./EarningsCard";
import { useNavigate } from "react-router-dom";
import { fetchPatients, searchPatients } from "../store/slices/patientsSlice";
import UserProfile from "./UserProfile";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );
  const { visits } = useSelector((state: RootState) => state.visits);
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
      <div className="bg-primary-600 text-gray-700  px-2 sticky top-0 z-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-pacifico brand-heading">Visitwise</h1>
          </div>
          <UserProfile />
        </div>
      </div>

      <div className="sticky px-4 space-y-3">
        <EarningsCard />
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-12 z-10  px-4 py-2 ">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search patients by name..."
          className="w-full p-2 rounded-lg shadow-md mb-2"
        />
      </div>

      {/* Patient List */}
      <div className="px-4 pb-4 space-y-3">
        {/* Archived Patients Card */}
        {archivedPatients.length > 0 && (
          <div
            className="animate-slide-up"
            style={{ animationDelay: `${activePatients.length * 0.1}s` }}
          >
            <div
              onClick={() => navigate("/archived-patients")}
              className="bg-white rounded-lg  shadow-sm border border-gray-200 p-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Archive className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">
                      Archived Patients ({archivedPatients.length})
                    </h3>
                  </div>
                </div>
                <div className="text-gray-400">
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
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">No active patients</p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/add-patient")}
                className="w-full max-w-xs bg-blue-400 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Patient
              </button>

              <p className="text-gray-500"> or </p>

              <button
                onClick={() => {
                  // TODO: Implement contact import functionality
                  alert("Contact import feature coming soon!");
                }}
                className="w-full max-w-xs bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 mx-auto border border-gray-300"
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
        className="fixed bottom-6 bg-blue-400 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors animate-bounce-in"
      >
        <Plus className="w-6 h-6 " />
      </button>
    </div>
  );
};

export default Home;

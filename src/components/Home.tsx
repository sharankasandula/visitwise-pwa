import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Plus, Archive, Navigation, Phone } from "lucide-react";
import PatientCard from "./PatientCard";
import EarningsCard from "./EarningsCard";
import { useNavigate } from "react-router-dom";
import { fetchPatients, searchPatients } from "../store/slices/patientsSlice";
import UserProfile from "./UserProfile";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
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

  const currentPatients =
    activeTab === "active" ? activePatients : archivedPatients;

  // Calculate visits this month
  // const currentMonth = new Date().getMonth();
  // const currentYear = new Date().getFullYear();
  // const visitsThisMonth = visits.filter((visit) => {
  //   const visitDate = new Date(visit.date);
  //   return (
  //     visitDate.getMonth() === currentMonth &&
  //     visitDate.getFullYear() === currentYear &&
  //     visit.completed
  //   );
  // }).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary-600 text-white bg-blue-400   px-2 sticky top-0 z-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-extrabold  text-white">Visitwise</h1>
          </div>
          <UserProfile />
        </div>
      </div>

      <div className="sticky    p-4 space-y-3">
        <EarningsCard />
      </div>

      {/* Tab View */}
      <div className="px-4 mt-4 pb-2">
        <div className="flex bg-gray-200 rounded-lg p-1 shadow-md">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Active Visits ({activePatients.length})
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "archived"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Archived ({archivedPatients.length})
          </button>
        </div>
      </div>
      {/* Sticky Search Bar */}
      <div className="sticky bg-gray-50 top-12 z-10  px-4 py-2 ">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search patients by name..."
          className="w-full p-2 rounded-lg shadow-md mb-2"
        />
      </div>

      {/* Patient List */}
      <div className="px-4 space-y-3">
        {currentPatients.map((patient, index) => (
          <div
            key={patient.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PatientCard patient={patient} />
          </div>
        ))}

        {currentPatients.length === 0 && (
          <div className="text-center py-12">
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {activeTab === "active"
                ? "No active patients"
                : "No archived patients"}
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/add-patient")}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors animate-bounce-in"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Home;

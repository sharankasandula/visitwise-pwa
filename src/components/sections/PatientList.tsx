import React from "react";
import { useNavigate } from "react-router-dom";
import { Archive } from "lucide-react";
import PatientCard from "../PatientCard";

interface Patient {
  id: string;
  name: string;
  isActive: boolean;
}

interface PatientListProps {
  activePatients: Patient[];
  archivedPatients: Patient[];
}

const PatientList: React.FC<PatientListProps> = ({
  activePatients,
  archivedPatients,
}) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 pb-4 text-muted space-y-3">
      {/* Archived Patients Card */}
      {archivedPatients.length > 0 && (
        <div
          className="animate-slide-up pl-1"
          style={{ animationDelay: `${activePatients.length * 0.1}s` }}
        >
          <div
            onClick={() => navigate("/archived-patients")}
            className="rounded-lg p-2 cursor-pointer transition-shadow"
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
    </div>
  );
};

export default PatientList;

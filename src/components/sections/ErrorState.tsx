import React from "react";
import { AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchPatients } from "../../store/slices/patientsSlice";

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const dispatch = useDispatch();

  return (
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
  );
};

export default ErrorState;

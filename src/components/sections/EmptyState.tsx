import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center flex flex-col items-center">
      <p className="text-muted-foreground text-2xl font-light leading-relaxed">
        Welcome to
        <span className="font-pacifico font-extralight px-2">Visitwise</span>
      </p>
      <img
        src="./illustrations/physio_illustration3.png"
        alt="Physiotherapist Illustration"
        className="w-auto h-auto pt-6"
      />
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl pt-4 font-light text-foreground">
          Start by adding your first patient.
        </h2>
      </div>

      <div>
        <button
          onClick={() => navigate("/add-patient")}
          className="w-full mt-4 max-w-xs py-3 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          Add Your First Patient
        </button>
      </div>
      <p className="text-sm pt-4 text-muted-foreground">
        Once you add patients, you'll be able to track your earnings, visits,
        and progress all in one place.
      </p>
      <p className="text-sm pt-4 text-muted-foreground">
        Get started in less than a minute.
      </p>
    </div>
  );
};

export default EmptyState;

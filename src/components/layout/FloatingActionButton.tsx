import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FloatingActionButtonProps {
  show: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  show,
}) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <button
      onClick={() => navigate("/add-patient")}
      title="Add Patient"
      aria-label="Add Patient"
      aria-hidden="true"
      data-tip="Add Patient"
      data-place="top"
      className="fixed bottom-6 bg-primary left-1/2 transform -translate-x-1/2 p-4 rounded-full transition-colors animate-bounce-in"
    >
      <Plus className="w-6 h-6 text-primary-foreground" />
    </button>
  );
};

export default FloatingActionButton;

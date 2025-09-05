import React from "react";
import { ArrowLeft, Edit, Archive, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientHeaderProps {
  isArchiving: boolean;
  onArchive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  isArchiving,
  onArchive,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className=" p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl font-bold">Patient Profile</h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onArchive}
            disabled={isArchiving}
            className={"p-2 rounded-full transition-colors"}
            title="Archive Patient"
          >
            <Archive className={`w-5 h-5`} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 rounded-full transition-colors"
            title="Edit Patient"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full transition-colors"
            title="Delete Patient"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;

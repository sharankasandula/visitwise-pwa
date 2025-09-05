import React from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MediaManagementLink: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/media")}
      className="rounded-lg p-4 cursor-pointer transition-all bg-accent/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Media Management</h3>
            <p className="text-sm text-muted-foreground">
              View and manage all patient media files
            </p>
          </div>
        </div>
        <div className="text-muted-foreground">
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
  );
};

export default MediaManagementLink;

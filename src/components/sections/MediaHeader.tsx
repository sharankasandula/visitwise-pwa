import React from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MediaHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Media Management</h1>
              <p className="text-muted-foreground">
                Manage all media files across patients
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Camera className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaHeader;

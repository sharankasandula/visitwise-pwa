import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="px-4 py-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <img
          src="./illustrations/physio_illustration1.png"
          alt="Loading"
          className="w-auto h-auto"
        />
        <p className="text-muted-foreground text-lg">Loading patients...</p>
      </div>
    </div>
  );
};

export default LoadingState;

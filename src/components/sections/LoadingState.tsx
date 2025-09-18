import React from "react";
import { BeautifulLoader } from "../ui";

const LoadingState: React.FC = () => {
  return (
    <div className="px-4 py-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <img
          src="./illustrations/physio_illustration1.png"
          alt="Loading"
          className="w-24 h-auto animate-float"
        />
        <BeautifulLoader
          size="lg"
          text="Loading patients..."
          variant="primary"
          showLogo={false}
        />
      </div>
    </div>
  );
};

export default LoadingState;

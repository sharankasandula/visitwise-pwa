import React from "react";
import BeautifulLoader from "./BeautifulLoader";

interface LoadingScreenProps {
  text?: string;
  showLogo?: boolean;
  variant?: "default" | "primary" | "secondary" | "gradient";
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  text = "Loading...",
  showLogo = true,
  variant = "gradient",
  className = "",
}) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 ${className}`}
    >
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          {/* Floating circles */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
          <div
            className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-secondary/5 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-primary/10 animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Main loading content */}
        <div className="relative z-10">
          <BeautifulLoader
            size="xl"
            text={text}
            variant={variant}
            showLogo={showLogo}
            className="animate-fade-in"
          />
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;

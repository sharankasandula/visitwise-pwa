import React from "react";

interface BeautifulLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  variant?: "default" | "primary" | "secondary" | "gradient";
  showLogo?: boolean;
  className?: string;
}

const BeautifulLoader: React.FC<BeautifulLoaderProps> = ({
  size = "md",
  text = "Loading...",
  variant = "default",
  showLogo = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "text-primary";
      case "secondary":
        return "text-secondary";
      case "gradient":
        return "bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {/* Animated Logo/Icon */}
      {showLogo && (
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse-slow flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary animate-spin"></div>
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary/30 animate-ping"></div>
        </div>
      )}

      {/* Main Spinner */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-muted/20 animate-spin`}
          style={{
            borderTopColor: "hsl(var(--primary))",
            borderRightColor: "hsl(var(--secondary))",
            animationDuration: "1.5s",
          }}
        ></div>

        {/* Inner pulsing dot */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse`}
          style={{
            animationDuration: "0.8s",
          }}
        ></div>

        {/* Glow effect */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-ping`}
          style={{
            animationDuration: "2s",
          }}
        ></div>
      </div>

      {/* Loading Text with Animation */}
      <div className="text-center">
        <p
          className={`${
            textSizeClasses[size]
          } ${getVariantStyles()} font-medium animate-pulse`}
        >
          {text}
        </p>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-2">
          <div
            className="w-1 h-1 bg-current rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-1 h-1 bg-current rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-1 h-1 bg-current rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BeautifulLoader;

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "default" | "primary" | "secondary";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  text,
  variant = "default",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
  };

  const spinnerElement = (
    <Loader2
      className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin ${className}`}
    />
  );

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        {spinnerElement}
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner;

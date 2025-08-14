import React from "react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variantClasses = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
  };

  const classes = `rounded-lg border p-4 ${variantClasses[variant]} ${className}`;

  return <div className={classes}>{children}</div>;
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = "",
}) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};

export { Alert, AlertDescription };

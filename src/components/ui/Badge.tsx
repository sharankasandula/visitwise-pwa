import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const baseClasses =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline:
      "text-foreground border border-border hover:bg-accent hover:text-accent-foreground",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Badge;

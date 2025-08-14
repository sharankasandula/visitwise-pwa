import React from "react";

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {children}
    </div>
  );
};

const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  className = "",
}) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || "Avatar"}
      className={`aspect-square h-full w-full ${className}`}
    />
  );
};

const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback };

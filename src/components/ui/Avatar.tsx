import React, { useState, cloneElement, isValidElement } from "react";

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
  onError?: () => void;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ children, className = "" }) => {
  const [imageError, setImageError] = useState(false);

  // Find AvatarImage and AvatarFallback components
  const childrenArray = React.Children.toArray(children);
  const avatarImage = childrenArray.find(
    (child) => isValidElement(child) && child.type === AvatarImage
  );
  const avatarFallback = childrenArray.find(
    (child) => isValidElement(child) && child.type === AvatarFallback
  );

  // Clone AvatarImage with error handler
  const imageWithErrorHandler =
    avatarImage && isValidElement(avatarImage)
      ? cloneElement(avatarImage, {
          onError: () => {
            setImageError(true);
            avatarImage.props.onError?.();
          },
        })
      : null;

  // Show fallback if no image source, image error, or no image component
  const shouldShowFallback =
    !avatarImage || imageError || !avatarImage.props.src;

  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {!shouldShowFallback && imageWithErrorHandler}
      {shouldShowFallback && avatarFallback}
    </div>
  );
};

const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  className = "",
  onError,
}) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || "Avatar"}
      className={`aspect-square h-full w-full ${className}`}
      onError={onError}
    />
  );
};

const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center border border-secondary rounded-full bg-accent text-accent-foreground ${className}`}
    >
      {children}
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback };

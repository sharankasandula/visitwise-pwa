import React, { useState, useRef, useEffect } from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  forceMount?: boolean;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <>{children}</>;
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild = false,
}) => {
  return <>{children}</>;
};

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className = "",
  align = "start",
  forceMount = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={toggleMenu}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onClick: toggleMenu });
          }
          return child;
        })}
      </div>

      {(isOpen || forceMount) && (
        <div
          ref={contentRef}
          className={`absolute top-full mt-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md ${alignClasses[align]} ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  className = "",
  disabled = false,
  onClick,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ${
        disabled
          ? "pointer-events-none opacity-50"
          : "hover:bg-gray-100 focus:bg-gray-100"
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>
      {children}
    </div>
  );
};

const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className = "",
}) => {
  return <div className={`-mx-1 my-1 h-px bg-gray-200 ${className}`} />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};

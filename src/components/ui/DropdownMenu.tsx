import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";

interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(
  undefined
);

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
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild = false,
}) => {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  const { isOpen, setIsOpen, triggerRef } = context;

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={triggerRef} onClick={handleClick}>
      {children}
    </div>
  );
};

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className = "",
  align = "start",
  forceMount = false,
}) => {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error("DropdownMenuContent must be used within DropdownMenu");

  const { isOpen, setIsOpen, triggerRef } = context;
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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setIsOpen, triggerRef]);

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  };

  if (!isOpen && !forceMount) return null;

  return (
    <div
      ref={contentRef}
      className={`absolute top-full mt-2 z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-card text-card-foreground shadow-lg p-1 ${alignClasses[align]} ${className}`}
      style={{
        position: "absolute",
        zIndex: 9999,
        minWidth: "12rem",
        maxWidth: "16rem",
      }}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  className = "",
  disabled = false,
  onClick,
}) => {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error("DropdownMenuItem must be used within DropdownMenu");

  const { setIsOpen } = context;

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ${
        disabled ? "pointer-events-none opacity-50" : "hover:bg-muted"
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

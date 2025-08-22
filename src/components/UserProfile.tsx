import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import { signOut } from "../store/slices/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { LogOut, User, Settings } from "lucide-react";

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    dispatch(signOut());
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 border border-border rounded-full  transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation"
        aria-label="User menu"
        aria-expanded={isDropdownOpen}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.photoURL} alt={user.name} />
          <AvatarFallback className=" text-card-foreground  text-sm font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-64 sm:w-72 bg-card rounded-lg shadow-lg border border-border py-2 z-50 max-h-[80vh] overflow-y-auto">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL} alt={user.name} />
                <AvatarFallback className="text-sm font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email || "No email"}
                </p>
                {user.isAnonymous && (
                  <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground px-2 py-0.5 text-xs font-medium mt-1">
                    Guest User
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              className="w-full flex items-center px-4 py-3 text-sm text-muted-foreground hover:bg-muted active:bg-muted/80 transition-colors touch-manipulation"
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/profile");
              }}
            >
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              Profile
            </button>

            <button
              className="w-full flex items-center px-4 py-3 text-sm text-muted-foreground hover:bg-muted active:bg-muted/80 transition-colors touch-manipulation"
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/settings");
              }}
            >
              <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
              Settings
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-border pt-1">
            <button
              className="w-full flex items-center px-4 py-3 text-sm text-destructive transition-colors touch-manipulation"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

import React, { useState } from "react";
import { Palette, Sun, Moon, Check } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  setThemeMode,
  setColorScheme,
  ColorScheme,
} from "../../store/slices/themeSlice";
import UserProfile from "../UserProfile";
import { Logo } from "../ui";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const { mode, colorScheme } = useSelector((state: RootState) => state.theme);

  const handleThemeChange = (newMode: "light" | "dark") => {
    dispatch(setThemeMode(newMode));
    setIsThemeDropdownOpen(false);
  };

  const handleColorSchemeChange = (newScheme: ColorScheme) => {
    dispatch(setColorScheme(newScheme));
    setIsThemeDropdownOpen(false);
  };

  // Theme preview component
  const ThemePreview = ({
    scheme,
    isSelected,
    onClick,
  }: {
    scheme: ColorScheme;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const getThemeColors = (scheme: ColorScheme) => {
      const colors: Record<
        ColorScheme,
        { primary: string; secondary: string }
      > = {
        "royal-plum": { primary: "bg-violet-500", secondary: "bg-indigo-500" },
        "ocean-blue": { primary: "bg-blue-500", secondary: "bg-sky-500" },
        "emerald-green": {
          primary: "bg-emerald-600",
          secondary: "bg-emerald-500",
        },
        "sunset-orange": { primary: "bg-orange-500", secondary: "bg-red-500" },
      };
      return colors[scheme];
    };

    const colors = getThemeColors(scheme);
    const label = scheme
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
          isSelected ? "bg-primary/10 text-primary" : "text-muted-foreground"
        }`}
      >
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded-full ${colors.primary}`}></div>
          <div className={`w-3 h-3 rounded-full ${colors.secondary}`}></div>
        </div>
        <span className="text-xs">{label}</span>
        {isSelected && <Check className="h-3 w-3 ml-auto" />}
      </button>
    );
  };

  return (
    <div className="px-2">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Logo size="lg" variant="primary" />
        </div>
        <div className="flex items-center gap-2">
          {/* Theme Mode Selection Button */}
          <div className="relative">
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Theme settings"
            >
              <Palette className="h-5 w-5" />
            </button>

            {/* Theme Dropdown */}
            {isThemeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border shadow-3xl rounded-lg z-50">
                <div className="p-2 space-y-1">
                  {/* Theme Mode Section */}
                  <div className="px-2 py-1">
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Theme Mode
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleThemeChange("light")}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                          mode === "light"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                        {mode === "light" && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </button>

                      <button
                        onClick={() => handleThemeChange("dark")}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                          mode === "dark"
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                        {mode === "dark" && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-2"></div>

                  {/* Color Scheme Section */}
                  <div className="px-2 py-1">
                    <div className="text-xs font-medium text-muted-foreground mb-2">
                      Color Scheme
                    </div>
                    <div className="space-y-1">
                      {(
                        [
                          "royal-plum",
                          "ocean-blue",
                          "emerald-green",
                          "sunset-orange",
                        ] as ColorScheme[]
                      ).map((scheme) => (
                        <ThemePreview
                          key={scheme}
                          scheme={scheme}
                          isSelected={colorScheme === scheme}
                          onClick={() => handleColorSchemeChange(scheme)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Header;

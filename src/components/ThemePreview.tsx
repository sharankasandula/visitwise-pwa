import React from "react";
import { ColorScheme } from "../store/slices/themeSlice";

interface ThemePreviewProps {
  scheme: ColorScheme;
  isSelected: boolean;
  onClick: () => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  scheme,
  isSelected,
  onClick,
}) => {
  const getPreviewColors = (scheme: ColorScheme) => {
    const colors = {
      "royal-plum": "from-violet-500 to-purple-600",
      "ocean-blue": "from-blue-500 to-sky-600",
      "emerald-green": "from-emerald-500 to-green-600",
      "sunset-orange": "from-orange-500 to-red-600",
    };
    return colors[scheme] || colors["royal-plum"];
  };

  const getSchemeName = (scheme: ColorScheme) => {
    const names = {
      "royal-plum": "Royal Plum",
      "ocean-blue": "Ocean Blue",
      "emerald-green": "Emerald Green",
      "sunset-orange": "Sunset Orange",
    };
    return names[scheme] || "Unknown";
  };

  return (
    <button
      onClick={onClick}
      className={`relative p-4 border-2 text-center rounded-lg transition-all group ${
        isSelected
          ? "border-primary bg-primary/10 shadow-lg"
          : "border-border hover:border-muted-foreground hover:bg-muted hover:shadow-md"
      }`}
    >
      {/* Color preview bar */}
      <div
        className={`w-full h-12 rounded-lg bg-gradient-to-r ${getPreviewColors(
          scheme
        )} mb-3 shadow-sm`}
      />

      {/* Scheme name */}
      <h4 className="font-medium text-card-foreground text-sm mb-1">
        {getSchemeName(scheme)}
      </h4>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-4 h-4 text-primary-foreground"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Hover effect */}
      <div
        className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
          isSelected ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        } bg-primary/5`}
      />
    </button>
  );
};

export default ThemePreview;

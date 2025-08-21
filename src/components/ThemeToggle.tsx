import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { toggleDarkMode } from "../store/slices/themeSlice";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDark } = useSelector((state: RootState) => state.theme);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors duration-200"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;

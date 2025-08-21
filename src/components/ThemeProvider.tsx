import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { updateSystemTheme } from "../store/slices/themeSlice";

// Theme definitions with HSL values
const themes = {
  "royal-plum": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "262 83% 58%", // violet-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "239 84% 67%", // indigo-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "262 83% 58%", // violet-500
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "262 83% 58%", // violet-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "239 84% 67%", // indigo-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "262 83% 58%", // violet-500
    },
  },
  "ocean-blue": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "221 83% 53%", // blue-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "199 89% 48%", // sky-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "221 83% 53%", // blue-500
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "221 83% 53%", // blue-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "199 89% 48%", // sky-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "221 83% 53%", // blue-500
    },
  },
  "emerald-green": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "142 76% 36%", // emerald-600
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "160 84% 39%", // emerald-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "142 76% 36%", // emerald-600
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "142 76% 36%", // emerald-600
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "160 84% 39%", // emerald-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "142 76% 36%", // emerald-600
    },
  },
  "sunset-orange": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "24 95% 53%", // orange-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "16 100% 50%", // red-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "24 95% 53%", // orange-500
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "24 95% 53%", // orange-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "16 100% 50%", // red-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "24 95% 53%", // orange-500
    },
  },
  "midnight-purple": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "262 83% 58%", // violet-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "280 65% 60%", // purple-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "262 83% 58%", // violet-500
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "262 83% 58%", // violet-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "280 65% 60%", // purple-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "262 83% 58%", // violet-500
    },
  },
  "rose-gold": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "346 77% 49%", // rose-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "25 95% 53%", // amber-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "346 77% 49%", // rose-500
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "346 77% 49%", // rose-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "25 95% 53%", // amber-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "346 77% 49%", // rose-500
    },
  },
  "forest-green": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "142 76% 36%", // emerald-600
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "158 64% 18%", // emerald-900
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "142 76% 36%", // emerald-600
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "142 76% 36%", // emerald-600
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "158 64% 18%", // emerald-900
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "142 76% 36%", // emerald-600
    },
  },
  "coral-red": {
    light: {
      "--background": "210 40% 98%", // slate-50
      "--foreground": "222 84% 5%", // slate-900
      "--card": "0 0% 100%", // white
      "--card-foreground": "222 84% 5%", // slate-900
      "--popover": "0 0% 100%", // white
      "--popover-foreground": "222 84% 5%", // slate-900
      "--primary": "0 84% 60%", // red-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "15 100% 50%", // red-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "210 40% 96%", // slate-100
      "--muted-foreground": "215 16% 47%", // slate-600
      "--accent": "210 40% 96%", // slate-100
      "--accent-foreground": "222 84% 5%", // slate-900
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "214 32% 91%", // slate-200
      "--input": "214 32% 91%", // slate-200
      "--ring": "0 84% 60%", // red-500
    },
    dark: {
      "--background": "222 84% 5%", // slate-900
      "--foreground": "210 40% 98%", // slate-50
      "--card": "222 84% 5%", // slate-900
      "--card-foreground": "210 40% 98%", // slate-50
      "--popover": "222 84% 5%", // slate-900
      "--popover-foreground": "210 40% 98%", // slate-50
      "--primary": "0 84% 60%", // red-500
      "--primary-foreground": "210 40% 98%", // slate-50
      "--secondary": "15 100% 50%", // red-500
      "--secondary-foreground": "210 40% 98%", // slate-50
      "--muted": "215 16% 47%", // slate-600
      "--muted-foreground": "210 40% 96%", // slate-100
      "--accent": "215 16% 47%", // slate-600
      "--accent-foreground": "210 40% 98%", // slate-50
      "--destructive": "0 84% 60%", // red-500
      "--destructive-foreground": "210 40% 98%", // slate-50
      "--border": "215 16% 47%", // slate-600
      "--input": "215 16% 47%", // slate-600
      "--ring": "0 84% 60%", // red-500
    },
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mode, colorScheme, isDark } = useSelector(
    (state: RootState) => state.theme
  );

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const theme = themes[colorScheme];

    if (theme) {
      const colorMode = isDark ? "dark" : "light";
      const themeColors = theme[colorMode];

      // Apply CSS variables
      Object.entries(themeColors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Apply dark mode class
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // Set data-theme attribute
      root.setAttribute("data-theme", colorScheme);
    }
  }, [colorScheme, isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (mode === "system") {
        dispatch(updateSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, dispatch]);

  return <>{children}</>;
};

export default ThemeProvider;

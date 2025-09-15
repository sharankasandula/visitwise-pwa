import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { updateSystemTheme } from "../store/slices/themeSlice";

// Theme definitions with HSL values
const themes = {
  "royal-plum": {
    light: {
      "--background": "280 31% 97%", // Soft lavender white
      "--foreground": "280 68% 13%", // Deep plum
      "--card": "280 20% 99%", // Near white with plum tint
      "--card-foreground": "280 68% 13%", // Deep plum
      "--popover": "280 20% 99%", // Near white with plum tint
      "--popover-foreground": "280 68% 13%", // Deep plum
      "--primary": "280 67% 50%", // Rich plum (AA compliant)
      "--primary-foreground": "0 0% 100%", // Pure white
      "--secondary": "270 50% 40%", // Royal purple (darker for contrast)
      "--secondary-foreground": "0 0% 100%", // Pure white
      "--muted": "280 30% 93%", // Muted plum
      "--muted-foreground": "280 40% 35%", // Dark plum gray
      "--accent": "290 48% 85%", // Light orchid
      "--accent-foreground": "280 68% 13%", // Deep plum
      "--destructive": "0 72% 51%", // Accessible red
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "280 20% 88%", // Soft plum border
      "--input": "280 20% 88%", // Soft plum border
      "--ring": "280 67% 50%", // Rich plum
      "--success": "152 69% 31%", // Deep emerald (AA compliant)
      "--success-foreground": "0 0% 100%",
      "--warning": "35 91% 38%", // Darker amber for contrast
      "--warning-foreground": "0 0% 100%",
      "--danger": "354 70% 45%", // Deep rose
      "--danger-foreground": "0 0% 100%",
    },
    dark: {
      "--background": "280 50% 7%", // Deep plum black
      "--foreground": "280 20% 95%", // Light plum white
      "--card": "280 45% 10%", // Dark plum card
      "--card-foreground": "280 20% 95%", // Light plum white
      "--popover": "280 45% 10%", // Dark plum card
      "--popover-foreground": "280 20% 95%", // Light plum white
      "--primary": "280 85% 66%", // Bright plum (AA on dark)
      "--primary-foreground": "280 50% 7%", // Deep plum black
      "--secondary": "270 73% 70%", // Light royal purple
      "--secondary-foreground": "280 50% 7%", // Deep plum black
      "--muted": "280 30% 25%", // Muted dark plum
      "--muted-foreground": "280 20% 85%", // Light plum gray
      "--accent": "290 60% 35%", // Dark orchid
      "--accent-foreground": "280 20% 95%", // Light plum white
      "--destructive": "0 78% 68%", // Bright red for dark mode
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "280 30% 25%", // Dark plum border
      "--input": "280 30% 25%", // Dark plum border
      "--ring": "280 85% 66%", // Bright plum
      "--success": "152 73% 58%", // Bright emerald for dark
      "--success-foreground": "152 50% 10%",
      "--warning": "35 95% 62%", // Bright amber for dark
      "--warning-foreground": "35 50% 10%",
      "--danger": "354 85% 65%", // Bright rose for dark
      "--danger-foreground": "354 50% 10%",
    },
  },
  "ocean-blue": {
    light: {
      "--background": "200 33% 97%", // Soft ocean mist
      "--foreground": "209 77% 12%", // Deep ocean blue
      "--card": "200 25% 99%", // Near white with ocean tint
      "--card-foreground": "209 77% 12%", // Deep ocean blue
      "--popover": "200 25% 99%", // Near white with ocean tint
      "--popover-foreground": "209 77% 12%", // Deep ocean blue
      "--primary": "209 100% 40%", // Deep ocean blue (AA compliant)
      "--primary-foreground": "0 0% 100%", // Pure white
      "--secondary": "193 82% 31%", // Deep teal (AA compliant)
      "--secondary-foreground": "0 0% 100%", // Pure white
      "--muted": "200 30% 92%", // Muted ocean
      "--muted-foreground": "209 45% 35%", // Dark ocean gray
      "--accent": "195 100% 85%", // Light cyan
      "--accent-foreground": "209 77% 12%", // Deep ocean blue
      "--destructive": "0 72% 51%", // Coral red
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "200 25% 87%", // Soft ocean border
      "--input": "200 25% 87%", // Soft ocean border
      "--ring": "209 100% 40%", // Deep ocean blue
      "--success": "160 84% 30%", // Sea green (AA compliant)
      "--success-foreground": "0 0% 100%",
      "--warning": "43 96% 40%", // Golden sand (darker)
      "--warning-foreground": "0 0% 100%",
      "--danger": "355 78% 45%", // Deep coral
      "--danger-foreground": "0 0% 100%",
    },
    dark: {
      "--background": "209 55% 6%", // Deep ocean black
      "--foreground": "200 25% 95%", // Light ocean white
      "--card": "209 50% 9%", // Dark ocean card
      "--card-foreground": "200 25% 95%", // Light ocean white
      "--popover": "209 50% 9%", // Dark ocean card
      "--popover-foreground": "200 25% 95%", // Light ocean white
      "--primary": "209 100% 62%", // Bright ocean blue (AA on dark)
      "--primary-foreground": "209 55% 6%", // Deep ocean black
      "--secondary": "193 92% 58%", // Bright teal
      "--secondary-foreground": "193 55% 6%", // Deep teal black
      "--muted": "209 30% 22%", // Muted dark ocean
      "--muted-foreground": "200 25% 85%", // Light ocean gray
      "--accent": "195 90% 35%", // Dark cyan
      "--accent-foreground": "200 25% 95%", // Light ocean white
      "--destructive": "0 85% 68%", // Bright coral for dark
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "209 30% 22%", // Dark ocean border
      "--input": "209 30% 22%", // Dark ocean border
      "--ring": "209 100% 62%", // Bright ocean blue
      "--success": "160 75% 55%", // Bright sea green for dark
      "--success-foreground": "160 50% 10%",
      "--warning": "43 100% 64%", // Bright golden sand for dark
      "--warning-foreground": "43 50% 10%",
      "--danger": "355 90% 65%", // Bright coral for dark
      "--danger-foreground": "355 50% 10%",
    },
  },
  "emerald-green": {
    light: {
      "--background": "152 30% 97%", // Soft mint white
      "--foreground": "155 75% 10%", // Deep forest green
      "--card": "152 23% 99%", // Near white with green tint
      "--card-foreground": "155 75% 10%", // Deep forest green
      "--popover": "152 23% 99%", // Near white with green tint
      "--popover-foreground": "155 75% 10%", // Deep forest green
      "--primary": "158 64% 35%", // Rich emerald (AA compliant)
      "--primary-foreground": "0 0% 100%", // Pure white
      "--secondary": "142 43% 39%", // Forest green (AA compliant)
      "--secondary-foreground": "0 0% 100%", // Pure white
      "--muted": "152 25% 91%", // Muted mint
      "--muted-foreground": "155 40% 32%", // Dark forest gray
      "--accent": "141 65% 82%", // Light jade
      "--accent-foreground": "155 75% 10%", // Deep forest green
      "--destructive": "0 72% 51%", // Ruby red
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "152 20% 86%", // Soft mint border
      "--input": "152 20% 86%", // Soft mint border
      "--ring": "158 64% 35%", // Rich emerald
      "--success": "142 76% 28%", // Deep emerald (AA compliant)
      "--success-foreground": "0 0% 100%",
      "--warning": "47 92% 38%", // Deep gold (darker)
      "--warning-foreground": "0 0% 100%",
      "--danger": "0 72% 45%", // Deep red
      "--danger-foreground": "0 0% 100%",
    },
    dark: {
      "--background": "155 45% 6%", // Deep forest black
      "--foreground": "152 20% 95%", // Light mint white
      "--card": "155 40% 9%", // Dark forest card
      "--card-foreground": "152 20% 95%", // Light mint white
      "--popover": "155 40% 9%", // Dark forest card
      "--popover-foreground": "152 20% 95%", // Light mint white
      "--primary": "158 85% 55%", // Bright emerald (AA on dark)
      "--primary-foreground": "155 45% 6%", // Deep forest black
      "--secondary": "142 70% 62%", // Bright jade
      "--secondary-foreground": "142 45% 8%", // Deep jade black
      "--muted": "155 25% 20%", // Muted dark forest
      "--muted-foreground": "152 20% 85%", // Light mint gray
      "--accent": "141 55% 32%", // Dark jade
      "--accent-foreground": "152 20% 95%", // Light mint white
      "--destructive": "0 82% 67%", // Bright ruby for dark
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "155 25% 20%", // Dark forest border
      "--input": "155 25% 20%", // Dark forest border
      "--ring": "158 85% 55%", // Bright emerald
      "--success": "142 85% 55%", // Bright emerald for dark
      "--success-foreground": "142 45% 8%",
      "--warning": "47 95% 62%", // Bright gold for dark
      "--warning-foreground": "47 45% 8%",
      "--danger": "0 80% 63%", // Bright red for dark
      "--danger-foreground": "0 45% 8%",
    },
  },
  "sunset-orange": {
    light: {
      "--background": "30 35% 97%", // Soft peach white
      "--foreground": "20 75% 12%", // Deep burnt orange
      "--card": "30 27% 99%", // Near white with warm tint
      "--card-foreground": "20 75% 12%", // Deep burnt orange
      "--popover": "30 27% 99%", // Near white with warm tint
      "--popover-foreground": "20 75% 12%", // Deep burnt orange
      "--primary": "24 90% 48%", // Vibrant sunset orange (AA compliant)
      "--primary-foreground": "0 0% 100%", // Pure white
      "--secondary": "12 76% 40%", // Deep terracotta (AA compliant)
      "--secondary-foreground": "0 0% 100%", // Pure white
      "--muted": "30 30% 91%", // Muted peach
      "--muted-foreground": "20 45% 32%", // Dark sunset gray
      "--accent": "39 90% 85%", // Light apricot
      "--accent-foreground": "20 75% 12%", // Deep burnt orange
      "--destructive": "354 70% 45%", // Deep crimson
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "30 25% 86%", // Soft peach border
      "--input": "30 25% 86%", // Soft peach border
      "--ring": "24 90% 48%", // Vibrant sunset orange
      "--success": "142 72% 29%", // Deep green (AA compliant)
      "--success-foreground": "0 0% 100%",
      "--warning": "45 93% 37%", // Deep golden yellow (darker)
      "--warning-foreground": "0 0% 100%",
      "--danger": "0 75% 42%", // Deep red-orange
      "--danger-foreground": "0 0% 100%",
    },
    dark: {
      "--background": "20 50% 6%", // Deep sunset black
      "--foreground": "30 25% 95%", // Light peach white
      "--card": "20 45% 9%", // Dark sunset card
      "--card-foreground": "30 25% 95%", // Light peach white
      "--popover": "20 45% 9%", // Dark sunset card
      "--popover-foreground": "30 25% 95%", // Light peach white
      "--primary": "24 100% 62%", // Bright sunset orange (AA on dark)
      "--primary-foreground": "20 50% 6%", // Deep sunset black
      "--secondary": "12 90% 65%", // Bright terracotta
      "--secondary-foreground": "12 50% 8%", // Deep terracotta black
      "--muted": "20 30% 20%", // Muted dark sunset
      "--muted-foreground": "30 25% 85%", // Light peach gray
      "--accent": "39 75% 35%", // Dark apricot
      "--accent-foreground": "30 25% 95%", // Light peach white
      "--destructive": "354 85% 65%", // Bright crimson for dark
      "--destructive-foreground": "0 0% 100%", // Pure white
      "--border": "20 30% 20%", // Dark sunset border
      "--input": "20 30% 20%", // Dark sunset border
      "--ring": "24 100% 62%", // Bright sunset orange
      "--success": "142 75% 55%", // Bright green for dark
      "--success-foreground": "142 50% 10%",
      "--warning": "45 100% 60%", // Bright golden yellow for dark
      "--warning-foreground": "45 50% 8%",
      "--danger": "0 85% 62%", // Bright red-orange for dark
      "--danger-foreground": "0 50% 8%",
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

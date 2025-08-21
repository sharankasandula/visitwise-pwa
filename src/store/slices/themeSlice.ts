import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ColorScheme =
  | "royal-plum"
  | "ocean-blue"
  | "emerald-green"
  | "sunset-orange"
  | "midnight-purple"
  | "rose-gold"
  | "forest-green"
  | "coral-red";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  isDark: boolean;
}

const getSystemTheme = (): boolean => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

const getStoredTheme = (): Partial<ThemeState> => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("visitwise-theme");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error parsing stored theme:", error);
    }
  }
  return {};
};

const initialState: ThemeState = {
  mode: "system",
  colorScheme: "royal-plum",
  isDark: getSystemTheme(),
  ...getStoredTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (action.payload === "system") {
        state.isDark = getSystemTheme();
      } else {
        state.isDark = action.payload === "dark";
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("visitwise-theme", JSON.stringify(state));
      }
    },
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("visitwise-theme", JSON.stringify(state));
      }
    },
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark;
      state.mode = state.isDark ? "dark" : "light";
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("visitwise-theme", JSON.stringify(state));
      }
    },
    updateSystemTheme: (state) => {
      if (state.mode === "system") {
        state.isDark = getSystemTheme();
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("visitwise-theme", JSON.stringify(state));
        }
      }
    },
  },
});

export const {
  setThemeMode,
  setColorScheme,
  toggleDarkMode,
  updateSystemTheme,
} = themeSlice.actions;

export default themeSlice.reducer;

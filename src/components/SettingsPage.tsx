import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import {
  setThemeMode,
  setColorScheme,
  ColorScheme,
} from "../store/slices/themeSlice";
import ThemePreview from "./ThemePreview";
import {
  User,
  Bell,
  Palette,
  Database,
  Trash2,
  Download,
  Upload,
  Sun,
  Moon,
  Monitor as Desktop,
  ArrowLeft,
  Check,
} from "lucide-react";
import { showSuccess, showDemoToast } from "../utils/toast";

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode, colorScheme, isDark } = useSelector(
    (state: RootState) => state.theme
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 pr-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-8 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Appearance Settings Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Appearance Settings
              </h2>
            </div>

            <div className="p-4 bg-accent/20 rounded-lg">
              {/* Theme Mode Selection */}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Theme Mode
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      dispatch(setThemeMode("light"));
                      showSuccess(
                        "Theme Updated",
                        "Light mode has been applied successfully!"
                      );
                    }}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      mode === "light"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Sun
                      className={`h-8 w-8 mb-2 ${
                        mode === "light"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm font-medium">Light</span>
                    {mode === "light" && (
                      <Check className="h-4 w-4 mt-1 text-primary" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      dispatch(setThemeMode("dark"));
                      showSuccess(
                        "Theme Updated",
                        "Dark mode has been applied successfully!"
                      );
                    }}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      mode === "dark"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Moon
                      className={`h-8 w-8 mb-2 ${
                        mode === "dark"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm font-medium">Dark</span>
                    {mode === "dark" && (
                      <Check className="h-4 w-4 mt-1 text-primary" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      dispatch(setThemeMode("system"));
                      showSuccess(
                        "Theme Updated",
                        "System theme mode has been applied successfully!"
                      );
                    }}
                    className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                      mode === "system"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Desktop
                      className={`h-8 w-8 mb-2 ${
                        mode === "system"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm font-medium">System</span>
                    {mode === "system" && (
                      <Check className="h-4 w-4 mt-1 text-primary" />
                    )}
                  </button>
                </div>

                {mode === "system" && (
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Currently using {isDark ? "dark" : "light"} mode based on
                    system preference
                  </p>
                )}
              </div>

              {/* Color Scheme Selection */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Color Scheme
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      onClick={() => {
                        dispatch(setColorScheme(scheme));
                        showSuccess(
                          "Color Scheme Updated",
                          `${scheme.replace(
                            "-",
                            " "
                          )} color scheme has been applied successfully!`
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          {/* <div>
            <div className="flex items-center gap-2 mb-6">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Account Settings
              </h2>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Account Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left border border-border text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
                <button className="w-full text-left border border-border text-muted-foreground hover:bg-muted px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
              </div>
            </div>
          </div> */}
          {/* Data & Storage Settings Section */}
          {/* <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Data & Storage Settings
            </h3>
          </div> */}
          {/* Toast Demo Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Toast Notifications Demo
              </h2>
            </div>
            <div className="p-6 bg-accent/20 rounded-lg">
              <button
                className=" text-left bg-secondary text-muted-foreground hover:bg-muted px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => showDemoToast("Hello, world!")}
              >
                Show Toast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

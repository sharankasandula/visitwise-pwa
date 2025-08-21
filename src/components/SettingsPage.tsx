import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
import {
  setThemeMode,
  setColorScheme,
  ColorScheme,
  ThemeMode,
} from "../store/slices/themeSlice";
import ThemePreview from "./ThemePreview";
import {
  Settings,
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

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode, colorScheme, isDark } = useSelector(
    (state: RootState) => state.theme
  );
  const [activeTab, setActiveTab] = useState("account");

  if (!user) return null;

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data & Storage", icon: Database },
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Full Name
            </label>
            <div className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground">
              {user.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </label>
            <div className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground">
              {user.email}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Account Type:</span>
            {user.isAnonymous ? (
              <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200">
                Guest User
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                Google Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Account Actions */}
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
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Push Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium text-card-foreground">
                  Appointment Reminders
                </p>
                <p className="text-sm text-muted-foreground">
                  Get notified before appointments
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-3 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-card-foreground">
                  Email Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive email updates
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Notification Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Reminder Time
            </label>
            <select className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground">
              <option>15 minutes before</option>
              <option>30 minutes before</option>
              <option>1 hour before</option>
              <option>2 hours before</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Quiet Hours
            </label>
            <select className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground">
              <option>9 PM - 8 AM</option>
              <option>10 PM - 7 AM</option>
              <option>11 PM - 6 AM</option>
              <option>No quiet hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      {/* Theme Mode Selection */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Theme Mode
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => dispatch(setThemeMode("light"))}
            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
              mode === "light"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-muted-foreground hover:bg-muted"
            }`}
          >
            <Sun
              className={`h-8 w-8 mb-2 ${
                mode === "light" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span className="text-sm font-medium">Light</span>
            {mode === "light" && (
              <Check className="h-4 w-4 mt-1 text-primary" />
            )}
          </button>

          <button
            onClick={() => dispatch(setThemeMode("dark"))}
            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
              mode === "dark"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-muted-foreground hover:bg-muted"
            }`}
          >
            <Moon
              className={`h-8 w-8 mb-2 ${
                mode === "dark" ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span className="text-sm font-medium">Dark</span>
            {mode === "dark" && <Check className="h-4 w-4 mt-1 text-primary" />}
          </button>

          <button
            onClick={() => dispatch(setThemeMode("system"))}
            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
              mode === "system"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-muted-foreground hover:bg-muted"
            }`}
          >
            <Desktop
              className={`h-8 w-8 mb-2 ${
                mode === "system" ? "text-primary" : "text-muted-foreground"
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
            Currently using {isDark ? "dark" : "light"} mode based on system
            preference
          </p>
        )}
      </div>

      {/* Color Scheme Selection */}
      <div className="p-6 bg-card border border-border rounded-lg">
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
              "midnight-purple",
              "rose-gold",
              "forest-green",
              "coral-red",
            ] as ColorScheme[]
          ).map((scheme) => (
            <ThemePreview
              key={scheme}
              scheme={scheme}
              isSelected={colorScheme === scheme}
              onClick={() => dispatch(setColorScheme(scheme))}
            />
          ))}
        </div>
      </div>

      {/* Display Settings */}
      <div className="p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Display
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Font Size
            </label>
            <select className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>Extra Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Color Scheme
            </label>
            <select className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground">
              <option>Default</option>
              <option>High Contrast</option>
              <option>Color Blind Friendly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Download className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium text-card-foreground">Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download your data in various formats
                </p>
              </div>
            </div>
            <button className="border border-border text-muted-foreground px-3 py-1 rounded-lg hover:bg-muted transition-colors">
              Export
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Upload className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="font-medium text-card-foreground">Import Data</p>
                <p className="text-sm text-muted-foreground">
                  Import data from other sources
                </p>
              </div>
            </div>
            <button className="border border-border text-muted-foreground px-3 py-1 rounded-lg hover:bg-muted transition-colors">
              Import
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Storage
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Storage Used</span>
              <span>2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: "24%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Patients</p>
              <p className="font-medium text-card-foreground">127 files</p>
            </div>
            <div>
              <p className="text-muted-foreground">Documents</p>
              <p className="font-medium text-card-foreground">45 files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return renderAccountSettings();
      case "notifications":
        return renderNotificationSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "data":
        return renderDataSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 border border-grey-200 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-8 h-4" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

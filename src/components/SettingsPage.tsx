import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../store";
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
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
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
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900">
              {user.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-900">
              {user.email}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Account Type:</span>
            {user.isAnonymous ? (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Guest User
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Google Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Actions
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left border border-gray-300 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
          <button className="w-full text-left border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Push Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Appointment Reminders
                </p>
                <p className="text-sm text-gray-500">
                  Get notified before appointments
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-3 text-blue-600"
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
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notification Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Time
            </label>
            <select className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2">
              <option>15 minutes before</option>
              <option>30 minutes before</option>
              <option>1 hour before</option>
              <option>2 hours before</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiet Hours
            </label>
            <select className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2">
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
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
            <Sun className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300">
            <Moon className="h-8 w-8 text-gray-600 mb-2" />
            <span className="text-sm font-medium">Dark</span>
          </button>
          <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300">
            <Desktop className="h-8 w-8 text-gray-600 mb-2" />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <select className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>Extra Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color Scheme
            </label>
            <select className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2">
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
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Download className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">
                  Download your data in various formats
                </p>
              </div>
            </div>
            <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              Export
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Upload className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Import Data</p>
                <p className="text-sm text-gray-500">
                  Import data from other sources
                </p>
              </div>
            </div>
            <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              Import
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Storage Used</span>
              <span>2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "24%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Patients</p>
              <p className="font-medium">127 files</p>
            </div>
            <div>
              <p className="text-gray-600">Documents</p>
              <p className="font-medium">45 files</p>
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
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">
                Manage your account preferences and settings
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </button>
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
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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

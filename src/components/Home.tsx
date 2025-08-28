import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  Plus,
  Archive,
  User,
  Moon,
  Sun,
  Search,
  Loader2,
  AlertCircle,
  Palette,
  Monitor as Desktop,
  Check,
} from "lucide-react";
import PatientCard from "./PatientCard";
import { useNavigate } from "react-router-dom";
import { fetchPatients, searchPatients } from "../store/slices/patientsSlice";
import UserProfile from "./UserProfile";
import EarningsCard from "./EarningsCard";
import {
  setThemeMode,
  setColorScheme,
  ColorScheme,
} from "../store/slices/themeSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const { mode, colorScheme } = useSelector((state: RootState) => state.theme);

  const { patients, loading, error } = useSelector(
    (state: RootState) => state.patients
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPatients() as any);
  }, [dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      dispatch(fetchPatients() as any);
    } else {
      dispatch(searchPatients(term) as any);
    }
  };

  const handleThemeChange = (newMode: "light" | "dark") => {
    dispatch(setThemeMode(newMode));
    setIsThemeDropdownOpen(false);
  };

  const handleColorSchemeChange = (newScheme: ColorScheme) => {
    dispatch(setColorScheme(newScheme));
    setIsThemeDropdownOpen(false);
  };

  const activePatients = patients.filter((p) => p.isActive);
  const archivedPatients = patients.filter((p) => !p.isActive);

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
          isSelected
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-2 ">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-pacifico brand-heading">Visitwise</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Mode Selection Button */}
            <div className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Theme settings"
              >
                <Palette className="h-5 w-5" />
              </button>

              {/* Theme Dropdown */}
              {isThemeDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg z-50">
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
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

      {/* Earnings Card */}
      {activePatients.length > 0 && (
        <div className="sticky px-4 space-y-3">
          <EarningsCard />
        </div>
      )}

      {/* Sticky Search Bar */}
      {activePatients.length > 0 && (
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 p-4">
          <label htmlFor="active-search" className="sr-only">
            Search patients
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search
                className="h-6 w-6 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <input
              id="active-search"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search patients by name..."
              className="h-11 w-full rounded-full bg-muted pl-11 pr-3
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search patients"
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="px-4 py-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <img
              src="./illustrations/physio_illustration1.png"
              alt="Loading"
              className="w-auto h-auto"
            />
            <p className="text-muted-foreground text-lg">Loading patients...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="px-4 py-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-destructive">
                  Error loading patients
                </h3>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(fetchPatients() as any)}
              className="mt-3 text-sm text-destructive hover:text-destructive/80 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Patient List - Only show when not loading and no error */}
      {!loading && !error && (
        <div className="px-4 pb-4 text-muted space-y-3">
          {/* Archived Patients Card */}
          {archivedPatients.length > 0 && (
            <div
              className="animate-slide-up pl-1"
              style={{ animationDelay: `${activePatients.length * 0.1}s` }}
            >
              <div
                onClick={() => navigate("/archived-patients")}
                className="rounded-lg p-2 cursor-pointer transition-shadow"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <Archive className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="">
                        Archived Patients ({archivedPatients.length})
                      </h3>
                    </div>
                  </div>
                  <div className="">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePatients.map((patient, index) => (
            <div
              key={patient.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PatientCard patient={patient} />
            </div>
          ))}

          {activePatients.length === 0 && (
            <div className="text-center flex flex-col items-center">
              <p className="text-muted-foreground text-2xl font-light leading-relaxed">
                Welcome to
                <span className="font-pacifico font-extralight px-2">
                  Visitwise
                </span>
              </p>
              <img
                src="./illustrations/physio_illustration3.png"
                alt="Physiotherapist Illustration"
                className="w-auto h-auto pt-6"
              />
              <div className="space-y-4 max-w-md">
                <h2 className="text-2xl pt-4 font-light text-foreground">
                  Start by adding your first patient.
                </h2>
              </div>

              <div>
                <button
                  onClick={() => navigate("/add-patient")}
                  className="w-full mt-4 max-w-xs py-3 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Patient
                </button>
              </div>
              <p className="text-sm pt-4 text-muted-foreground">
                Once you add patients, you'll be able to track your earnings,
                visits, and progress all in one place.
              </p>
              <p className="text-sm pt-4 text-muted-foreground">
                Get started in less than a minute.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      {activePatients.length >= 1 && (
        <button
          onClick={() => navigate("/add-patient")}
          title="Add Patient"
          aria-label="Add Patient"
          aria-hidden="true"
          data-tip="Add Patient"
          data-place="top"
          className="fixed bottom-6 bg-primary left-1/2 transform -translate-x-1/2 p-4 rounded-full transition-colors animate-bounce-in"
        >
          <Plus className="w-6 h-6 text-primary-foreground" />
        </button>
      )}
    </div>
  );
};

export default Home;

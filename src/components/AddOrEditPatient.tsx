import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Save,
  X,
  User,
  CreditCard,
  Stethoscope,
  Bell,
} from "lucide-react";
import {
  addPatientAsync,
  updatePatientAsync,
  Patient,
  NewPatient,
} from "../store/slices/patientsSlice";
import { RootState } from "../store";
import { showSuccess, showError, showLoading } from "../utils/toast";

const AddOrEditPatient: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(patientId || id);
  const currentPatientId = patientId || id;

  // Get patient data if editing
  const existingPatient = useSelector((state: RootState) =>
    currentPatientId
      ? state.patients.patients.find((p) => p.id === currentPatientId)
      : null
  );

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    addressCoordinates: "",
    googleMapsLink: "",
    chargePerVisit: 0,
    condition: "",
    protocol: "",
    notes: "",
    dailyVisitReminderEnabled: true,
    paymentCollectionReminderEnabled: true,
    followUpReminderEnabled: true,
    followUpReminderDays: 7,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  // Load existing patient data when editing
  useEffect(() => {
    if (existingPatient) {
      setFormData({
        name: existingPatient.name || "",
        age: existingPatient.age?.toString() || "",
        gender: existingPatient.gender || "",
        phone: existingPatient.phone || "",
        addressCoordinates: existingPatient.addressCoordinates || "",
        googleMapsLink: existingPatient.googleMapsLink || "",
        chargePerVisit: existingPatient.chargePerVisit || 0,
        condition: existingPatient.condition || "",
        protocol: existingPatient.protocol || "",
        notes: existingPatient.notes || "",
        dailyVisitReminderEnabled: existingPatient.dailyVisitReminderEnabled,
        paymentCollectionReminderEnabled:
          existingPatient.paymentCollectionReminderEnabled,
        followUpReminderEnabled: existingPatient.followUpReminderEnabled,
        followUpReminderDays: existingPatient.followUpReminderDays,
      });
    }
  }, [existingPatient]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
    setIsGenderDropdownOpen(false);

    if (errors.gender) {
      setErrors((prev) => ({
        ...prev,
        gender: "",
      }));
    }
  };

  const handleReminderChange = (type: string, value: boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required";
    }

    if (!(formData.chargePerVisit > 0)) {
      newErrors.chargePerVisit = "Charge per visit cannot be negative";
    }

    if (
      formData.age &&
      (parseInt(formData.age) < 1 || parseInt(formData.age) > 150)
    ) {
      newErrors.age = "Age must be between 1 and 150";
    }

    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && existingPatient) {
        // Update existing patient
        const updatedPatient: Patient = {
          ...existingPatient,
          name: formData.name.trim(),
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          phone: formData.phone.trim() || null,
          addressCoordinates: formData.addressCoordinates.trim() || "",
          googleMapsLink: formData.googleMapsLink.trim() || "",
          chargePerVisit: formData.chargePerVisit,
          condition: formData.condition.trim() || "",
          protocol: formData.protocol.trim() || "",
          notes: formData.notes.trim() || "",
          dailyVisitReminderEnabled: formData.dailyVisitReminderEnabled,
          paymentCollectionReminderEnabled:
            formData.paymentCollectionReminderEnabled,
          followUpReminderEnabled: formData.followUpReminderEnabled,
          followUpReminderDays: formData.followUpReminderDays,
        };

        await dispatch(updatePatientAsync(updatedPatient) as any);
        showSuccess(
          "Patient Updated Successfully!",
          `${formData.name}'s information has been updated.`
        );
      } else {
        // Add new patient
        const newPatient: NewPatient = {
          name: formData.name.trim(),
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          phone: formData.phone.trim() || null,
          addressCoordinates: formData.addressCoordinates.trim() || "",
          googleMapsLink: formData.googleMapsLink.trim() || "",
          chargePerVisit: formData.chargePerVisit,
          condition: formData.condition.trim() || "",
          protocol: formData.protocol.trim() || "",
          notes: formData.notes.trim() || "",
          isActive: true,
          dailyVisitReminderEnabled: formData.dailyVisitReminderEnabled,
          paymentCollectionReminderEnabled:
            formData.paymentCollectionReminderEnabled,
          followUpReminderEnabled: formData.followUpReminderEnabled,
          followUpReminderDays: formData.followUpReminderDays,
          userId: "",
        };

        await dispatch(addPatientAsync(newPatient) as any);
        showSuccess(
          "Patient Added Successfully!",
          `${formData.name} has been added to your patient list.`
        );
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving patient:", error);
      showError(
        `Failed to ${isEditing ? "update" : "add"} patient`,
        "Please try again. If the problem persists, contact support."
      );
      setErrors({
        submit: `Failed to ${
          isEditing ? "update" : "add"
        } patient. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-card/80 border-b border-border/50 p-4 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="mr-3 p-2 rounded-full transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold">
          {isEditing ? "Edit Patient" : "Add New Patient"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Basic Information */}
        <div className="group bg-card rounded-xl p-6 border border-border/50 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3">
              <User className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Basic Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                  errors.name
                    ? "border-destructive ring-destructive/20"
                    : "border-border hover:border-primary/30"
                }`}
                placeholder="Enter patient name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-destructive flex items-center">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full mr-2"></span>
                  {errors.name}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="1"
                  max="150"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                    errors.age
                      ? "border-destructive ring-destructive/20"
                      : "border-border hover:border-primary/30"
                  }`}
                  placeholder="Enter patient age"
                />
                {errors.age && (
                  <p className="mt-2 text-sm text-destructive flex items-center">
                    <span className="w-1.5 h-1.5 bg-destructive rounded-full mr-2"></span>
                    {errors.age}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Gender *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsGenderDropdownOpen(!isGenderDropdownOpen)
                    }
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-left flex items-center justify-between bg-background/50 backdrop-blur-sm ${
                      formData.gender
                        ? "text-card-foreground border-primary/30"
                        : "text-muted-foreground border-border hover:border-primary/30"
                    } ${
                      errors.gender
                        ? "border-destructive ring-destructive/20"
                        : ""
                    }`}
                  >
                    {formData.gender || "Select gender"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isGenderDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isGenderDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg backdrop-blur-sm">
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => handleGenderSelect("Male")}
                          className="w-full px-3 py-2 text-left hover:bg-accent text-card-foreground transition-colors duration-150"
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenderSelect("Female")}
                          className="w-full px-3 py-2 text-left hover:bg-accent text-card-foreground transition-colors duration-150"
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenderSelect("Other")}
                          className="w-full px-3 py-2 text-left hover:bg-accent text-card-foreground transition-colors duration-150"
                        >
                          Other
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {errors.gender && (
                  <p className="mt-2 text-sm text-destructive flex items-center">
                    <span className="w-1.5 h-1.5 bg-destructive rounded-full mr-2"></span>
                    {errors.gender}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background/50 backdrop-blur-sm hover:border-primary/30"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Google Maps Link
              </label>
              <input
                type="url"
                name="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleInputChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-background/50 backdrop-blur-sm hover:border-primary/30"
                placeholder="https://maps.google.com/?q=coordinates"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="group bg-card rounded-xl p-6 border border-border/50 transition-all duration-300 hover:border-secondary/20">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3">
              <CreditCard className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Financial Details
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Charge per Visit *
            </label>
            <input
              type="number"
              name="chargePerVisit"
              value={formData.chargePerVisit}
              onChange={handleInputChange}
              required
              min="0"
              max="10000"
              step="1"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200 bg-background/50 backdrop-blur-sm ${
                errors.chargePerVisit
                  ? "border-destructive ring-destructive"
                  : "border-border hover:border-secondary"
              }`}
              placeholder="500"
            />
            {errors.chargePerVisit && (
              <p className="mt-2 text-sm text-destructive flex items-center">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full mr-2"></span>
                {errors.chargePerVisit}
              </p>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="group bg-card rounded-xl p-6 border border-border transition-all duration-300 hover:border-accent">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3">
              <Stethoscope className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Medical Details
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Condition *
              </label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-background/50 backdrop-blur-sm hover:border-accent"
                placeholder="e.g., Lower back pain"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Protocol
              </label>
              <input
                type="text"
                name="protocol"
                value={formData.protocol}
                onChange={handleInputChange}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 bg-background/50 backdrop-blur-sm hover:border-accent/30"
                placeholder="e.g., Strengthening exercises"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 bg-background/50 backdrop-blur-sm hover:border-accent/30 resize-none"
                placeholder="Additional notes about the patient"
              />
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="group bg-card rounded-xl p-6 border border-border/50 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3">
              <Bell className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">
              Reminder Settings
            </h2>
          </div>

          <div className="space-y-4">
            {/* <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-sm font-medium text-muted-foreground">
                Daily Visit Reminder
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.dailyVisitReminderEnabled}
                  onChange={() =>
                    handleReminderChange(
                      "dailyVisitReminderEnabled",
                      !formData.dailyVisitReminderEnabled
                    )
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div
                  className={`block h-6 w-11 rounded-full transition-all duration-300 ${
                    formData.dailyVisitReminderEnabled
                      ? "bg-secondary"
                      : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                    formData.dailyVisitReminderEnabled
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div> */}

            <div className="flex items-center justify-between p-3 flex-start gap-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Payment Collection Reminder
                </span>
                <span className="text-xs text-muted-foreground">
                  Outstanding amount will be reminded to collect from the
                  patient
                </span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.paymentCollectionReminderEnabled}
                  onChange={() =>
                    handleReminderChange(
                      "paymentCollectionReminderEnabled",
                      !formData.paymentCollectionReminderEnabled
                    )
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div
                  className={`block h-6 w-11 rounded-full transition-all duration-300 ${
                    formData.paymentCollectionReminderEnabled
                      ? "bg-secondary"
                      : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                    formData.paymentCollectionReminderEnabled
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>

            {/* <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <span className="text-sm font-medium text-muted-foreground">
                Follow-up Reminder
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.followUpReminderEnabled}
                  onChange={() =>
                    handleReminderChange(
                      "followUpReminderEnabled",
                      !formData.followUpReminderEnabled
                    )
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div
                  className={`block h-6 w-11 rounded-full transition-all duration-300 ${
                    formData.followUpReminderEnabled
                      ? "bg-secondary"
                      : "bg-muted"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                    formData.followUpReminderEnabled
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>

            {formData.followUpReminderEnabled && (
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Follow-up after (days)
                </label>
                <input
                  type="number"
                  value={formData.followUpReminderDays}
                  onChange={(e) =>
                    handleReminderChange(
                      "followUpReminderDays",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full p-3 border border-accent/30 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200 bg-background/50 backdrop-blur-sm"
                  min="1"
                  max="30"
                />
              </div>
            )} */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center py-3 px-4 border border-border rounded-lg text-muted-foreground hover:bg-muted hover:border-primary/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-colors text-primary-foreground ${
              isSubmitting ? "bg-muted cursor-not-allowed" : "bg-primary"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isEditing ? "Updating..." : "Adding Patient..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {isEditing ? "Update Patient" : "Save Patient"}
              </>
            )}
          </button>
        </div>

        {errors.submit && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in">
            <p className="text-destructive text-sm flex items-center">
              <span className="w-2 h-2 bg-destructive rounded-full mr-2"></span>
              {errors.submit}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddOrEditPatient;

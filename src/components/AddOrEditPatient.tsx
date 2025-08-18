import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Save, X } from "lucide-react";
import {
  addPatientAsync,
  updatePatientAsync,
  Patient,
  NewPatient,
} from "../store/slices/patientsSlice";
import { RootState } from "../store";

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
      }

      navigate("/");
    } catch (error) {
      console.error("Error saving patient:", error);
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
      <div className="bg-primary-600 bg-gray-700 text-white p-4 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="mr-3 p-1 hover:bg-primary-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">
          {isEditing ? "Edit Patient" : "Add New Patient"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter patient name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                max="150"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter patient age"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-left flex items-center justify-between ${
                    formData.gender ? "text-gray-900" : "text-gray-500"
                  } ${errors.gender ? "border-red-500" : "border-gray-300"}`}
                >
                  {formData.gender || "Select gender"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isGenderDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isGenderDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => handleGenderSelect("Male")}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-900"
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenderSelect("Female")}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-900"
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenderSelect("Other")}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-900"
                      >
                        Other
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps Link
              </label>
              <input
                type="url"
                name="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://maps.google.com/?q=coordinates"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Financial Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.chargePerVisit ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="500"
            />
            {errors.chargePerVisit && (
              <p className="mt-1 text-sm text-red-600">
                {errors.chargePerVisit}
              </p>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Medical Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition *
              </label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Lower back pain"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protocol
              </label>
              <input
                type="text"
                name="protocol"
                value={formData.protocol}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Strengthening exercises"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Additional notes about the patient"
              />
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Reminder Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Daily Visit Reminder
              </span>
              <button
                type="button"
                onClick={() =>
                  handleReminderChange(
                    "dailyVisitReminderEnabled",
                    !formData.dailyVisitReminderEnabled
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.dailyVisitReminderEnabled
                    ? "bg-primary-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.dailyVisitReminderEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Payment Collection Reminder
              </span>
              <button
                type="button"
                onClick={() =>
                  handleReminderChange(
                    "paymentCollectionReminderEnabled",
                    !formData.paymentCollectionReminderEnabled
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.paymentCollectionReminderEnabled
                    ? "bg-primary-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.paymentCollectionReminderEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Follow-up Reminder
              </span>
              <button
                type="button"
                onClick={() =>
                  handleReminderChange(
                    "followUpReminderEnabled",
                    !formData.followUpReminderEnabled
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.followUpReminderEnabled
                    ? "bg-primary-600"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.followUpReminderEnabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {formData.followUpReminderEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                  max="30"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center py-3 px-4 bg-amber-700 rounded-lg transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700"
            } text-white`}
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddOrEditPatient;

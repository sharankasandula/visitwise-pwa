import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Edit,
  Archive,
  Phone,
  Navigation,
  Calendar,
  DollarSign,
  FileText,
  Camera,
  Trash2,
  CaseUpper,
} from "lucide-react";
import { RootState } from "../store";
import {
  setPatientActiveStatus,
  fetchPatients,
  deletePatientAsync,
} from "../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";

import { format } from "date-fns";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, loading } = useSelector(
    (state: RootState) => state.patients
  );
  const { visits } = useSelector((state: RootState) => state.visits);
  const [patient, setPatient] = useState<any>(null);

  const patientVisits = visits[id || ""] || [];

  const [activeTab, setActiveTab] = useState<
    "details" | "history" | "payments" | "reminders" | "media"
  >("details");
  useEffect(() => {
    // Try to get patient from state
    const foundPatient = patients.find((p) => p.id === id);
    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      // If not found, fetch from server
      dispatch(fetchPatients() as any).then((action: any) => {
        const fetchedPatient = action.payload.find((p: any) => p.id === id);
        setPatient(fetchedPatient || null);
      });
    }
  }, [id, patients, dispatch]);

  useEffect(() => {
    if (patient?.id && !visits[patient.id]) {
      dispatch(fetchVisitsAsync(patient.id) as any);
    }
  }, [patient?.id, visits, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Loading patient...</div>
      </div>
    );
  }
  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Patient not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const handleArchive = () => {
    console.log("Archiving patient:", patient.id);
    dispatch(setPatientActiveStatus(patient.id, !patient.isActive) as any);
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/edit-patient/${patient.id}`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${patient.name}? This action cannot be undone.`
      )
    ) {
      try {
        await dispatch(deletePatientAsync(patient.id) as any);
        navigate("/");
      } catch (error) {
        console.error("Error deleting patient:", error);
        // You could add a toast notification here
      }
    }
  };

  const handleCall = () => {
    window.open(`tel:${patient.phone}`, "_self");
  };

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(patient.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank");
  };

  const tabs = [
    { id: "details", label: "Details", icon: FileText },
    { id: "history", label: "History", icon: Calendar },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "reminders", label: "Reminders", icon: Calendar },
    { id: "media", label: "Media", icon: Camera },
  ];

  const completedVisits = patientVisits.filter((v) => v.completed);
  const pendingVisits = patientVisits.length - completedVisits.length;
  const totalEarned = completedVisits.length * (patient?.chargePerVisit ?? 0);
  const totalDue = 0; // TODO: Calculate total due based on visits and payments

  return (
    <div className="min-h-screen bg-zinc-200">
      {/* Header */}
      <div className="bg-primary-600 p-2">
        <div className="flex items-center justify-between">
          <div className="flex  items-center">
            <button
              onClick={() => navigate("/")}
              className="mr-1  p-1 hover:bg-primary-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{patient.name}</h1>
              <p className="text-primary-100 text-sm capitalize">
                {patient.condition}
              </p>
              <p className="text-primary-100 text-gray-500 text-sm font-medium">
                {patientVisits.length}{" "}
                {patientVisits.length === 1 ? (
                  <span>visit</span>
                ) : (
                  <span>visits</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleArchive}
              className="p-2 hover:bg-primary-700 rounded-full transition-colors"
              title="Archive Patient"
            >
              <Archive className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-primary-700 rounded-full transition-colors"
              title="Edit Patient"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-600 rounded-full transition-colors"
              title="Delete Patient"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pr-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "details" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center-safe">
                  <div className="text-gray-600">Phone:</div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCall}
                      className="hover:bg-primary-700 min-w-0 min-h-0 rounded-full transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <div className="font-medium">{patient.phone}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center-safe">
                  <div className="text-gray-600">Address:</div>
                  <div className="flex items-center space-x-2 align-items-center">
                    <button
                      onClick={handleNavigate}
                      className="hover:bg-primary-700 rounded-full transition-colors"
                    >
                      <Navigation className="w-5 h-5" />
                    </button>
                    <div> Google Maps</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Medical Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{patient.age ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">{patient.gender ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium">{patient.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protocol:</span>
                  <span className="font-medium">{patient.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Charge per Visit:</span>
                  <span className="font-medium">₹{patient.chargePerVisit}</span>
                </div>
              </div>
            </div>

            {patient.notes && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold mb-3">Notes</h3>
                <p className="text-gray-700">{patient.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {/* <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Visit Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {completedVisits}
                  </p>
                  <p className="text-sm text-gray-600">Completed Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary-600">
                    {pendingVisits}
                  </p>

                  <p className="text-sm text-gray-600">Pending Visits</p>
                </div>
              </div>
            </div> */}

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold">
                  Visit History ({patientVisits.length})
                </h3>
              </div>
              <div className="divide-y">
                {patientVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(visit.date), "EEEE, dd MMM yyyy")}
                      </p>
                      {/* <p className="text-sm text-gray-500">
                        {visit.completed ? "Completed" : "Pending"}
                      </p> */}
                      <p className="text-sm text-gray-500">
                        {visit.notes || "No notes"}
                      </p>
                    </div>
                    <div className="text-right">
                      {/* {visit.paymentReceived && visit.paymentReceived > 0 && (
                        <p className="font-medium text-green-600">
                          ₹{visit.paymentReceived}
                        </p>
                      )} */}
                      <p className="text-sm text-gray-500">
                        ₹{patient?.chargePerVisit || 0}
                      </p>
                    </div>
                  </div>
                ))}
                {patientVisits.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No visits recorded yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{totalEarned}
                  </p>
                  <p className="text-sm text-gray-600">Total Collected</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{totalDue}
                  </p>
                  <p className="text-sm text-gray-600">Outstanding</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Payment Actions</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Record Payment
                </button>
                <button className="w-full py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Send Payment Reminder
                </button>
                {totalDue <= 0 && (
                  <button className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Clear Dues & Mark Inactive
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reminders" && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Reminder Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Visit Reminder</p>
                  <p className="text-sm text-gray-600">
                    Get notified about daily visits
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full ${
                    patient.reminders.dailyVisit
                      ? "bg-primary-600"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      patient.reminders.dailyVisit
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Collection</p>
                  <p className="text-sm text-gray-600">
                    Remind to collect payments
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full ${
                    patient.reminders.paymentCollection
                      ? "bg-primary-600"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      patient.reminders.paymentCollection
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Follow-up Reminder</p>
                  <p className="text-sm text-gray-600">
                    Follow up after {patient.reminders.followUp.days} days
                  </p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full ${
                    patient.reminders.followUp.enabled
                      ? "bg-primary-600"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      patient.reminders.followUp.enabled
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    } mt-0.5`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Feature yet to be implemented</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <span>Add Media</span>
                </button>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No media uploaded yet</p>
                <p className="text-sm">
                  Upload images or videos to track progress
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;

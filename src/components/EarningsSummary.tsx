import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarCheck2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { RootState, AppDispatch } from "../store";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { fetchPaymentsAsync } from "../store/slices/paymentsSlice";

const EarningsSummary: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { patients } = useSelector((state: RootState) => state.patients);
  const { visits } = useSelector((state: RootState) => state.visits);
  const { payments } = useSelector((state: RootState) => state.payments);

  // Fetch visits and payments for all patients
  useEffect(() => {
    if (!patients || patients.length === 0) return;
    patients.forEach((patient) => {
      if (!visits[patient.id]) {
        dispatch(fetchVisitsAsync(patient.id) as any);
      }
      if (!payments[patient.id]) {
        dispatch(fetchPaymentsAsync(patient.id) as any);
      }
    });
  }, [dispatch, patients, visits, payments]);

  // Calculate earnings by patient with actual payment data
  const earningsByPatient = useMemo(() => {
    return patients
      .map((patient) => {
        const patientVisits = visits[patient.id] || [];
        const patientPayments = payments[patient.id] || [];

        const completedVisits = patientVisits.filter((v) => v.completed);
        const totalEarned = completedVisits.reduce((sum, visit) => {
          const visitCharge = Number(visit.charge) || 0;
          return (
            sum + (visitCharge > 0 ? visitCharge : patient.chargePerVisit || 0)
          );
        }, 0);

        const totalCollected = patientPayments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        const totalDue = Math.max(0, totalEarned - totalCollected);

        return {
          ...patient,
          visitsCompleted: completedVisits.length,
          totalEarned,
          totalCollected,
          totalDue,
        };
      })
      .filter((p) => p.visitsCompleted > 0);
  }, [patients, visits, payments]);

  // Calculate overall summary
  const summary = useMemo(() => {
    const total = earningsByPatient.reduce((sum, p) => sum + p.totalEarned, 0);
    const collected = earningsByPatient.reduce(
      (sum, p) => sum + p.totalCollected,
      0
    );
    const outstanding = total - collected;

    return { total, collected, outstanding };
  }, [earningsByPatient]);

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-primary-600 p-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className="mr-3 p-1 hover:bg-primary-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Earnings Summary</h1>
            <p className="text-primary-100 text-sm">
              Complete financial overview
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Total Earnings Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Earnings
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  ₹{summary.total.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <CalendarCheck2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Collected vs Outstanding */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Collected</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{summary.collected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Outstanding
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₹{summary.outstanding.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Collection Progress
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {summary.total > 0
                ? Math.round((summary.collected / summary.total) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  summary.total > 0
                    ? (summary.collected / summary.total) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Earnings by Patient */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Earnings by Patient</h3>
          </div>
          <div className="divide-y">
            {earningsByPatient.map((patient) => (
              <div key={patient.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">
                      {patient.visitsCompleted} visits completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">
                      ₹{patient.totalEarned.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      ₹{patient.totalCollected.toLocaleString()} collected
                    </p>
                    {patient.totalDue > 0 && (
                      <p className="text-sm text-orange-600">
                        ₹{patient.totalDue.toLocaleString()} outstanding
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        patient.totalEarned > 0
                          ? (patient.totalCollected / patient.totalEarned) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {earningsByPatient.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No earnings data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummary;

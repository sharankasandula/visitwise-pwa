import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck2,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { fetchPaymentsAsync } from "../store/slices/paymentsSlice";

const EarningsCard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector((state: any) => state.patients);
  const visitsByPatient = useSelector((state: any) => state.visits.visits);
  const paymentsByPatient = useSelector(
    (state: any) => state.payments.payments
  );

  // Fetch visits and payments for any patient whose data isn't loaded yet
  useEffect(() => {
    if (!patients || patients.length === 0) return;
    patients.forEach((patient: any) => {
      if (!visitsByPatient[patient.id]) {
        dispatch(fetchVisitsAsync(patient.id) as any);
      }
      if (!paymentsByPatient[patient.id]) {
        dispatch(fetchPaymentsAsync(patient.id) as any);
      }
    });
  }, [dispatch, patients, visitsByPatient, paymentsByPatient]);

  const { totalEarnings, totalCollected, totalOutstanding, totalVisits } =
    useMemo(() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let earningsSum = 0;
      let collectedSum = 0;
      let visitsCount = 0;

      patients.forEach((patient: any) => {
        const visits = visitsByPatient[patient.id] || [];
        const payments = paymentsByPatient[patient.id] || [];

        const visitsThisMonth = visits.filter((v: any) => {
          const d = new Date(v.date);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });
        const numVisits = visitsThisMonth.length;
        visitsCount += numVisits;

        // Calculate earnings from visits this month
        visitsThisMonth.forEach((visit: any) => {
          const visitCharge = Number(visit.charge) || 0;
          if (visitCharge > 0) {
            earningsSum += visitCharge;
          } else {
            earningsSum += patient.chargePerVisit || 0;
          }
        });

        // Calculate payments collected this month
        const paymentsThisMonth = payments.filter((p: any) => {
          const d = new Date(p.date);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });

        paymentsThisMonth.forEach((payment: any) => {
          collectedSum += payment.amount;
        });
      });

      const outstanding = Math.max(0, earningsSum - collectedSum);

      return {
        totalEarnings: earningsSum,
        totalCollected: collectedSum,
        totalOutstanding: outstanding,
        totalVisits: visitsCount,
      };
    }, [patients, visitsByPatient, paymentsByPatient]);

  const handleCardClick = () => {
    navigate("/earnings");
  };

  return (
    <div
      className="rounded-xl p-4 border  cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Header with title and chevron */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
          Earnings this month
        </p>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>

      {/* Compact three-column layout */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Total Earnings */}
        <div className="text-center">
          <p className="text-xs text-blue-600 font-medium mb-1">Total</p>
          <p className="text-sm font-bold text-blue-700">
            ₹{totalEarnings.toLocaleString()}
          </p>
        </div>

        {/* Collected */}
        <div className="text-center">
          <p className="text-xs text-green-600 font-medium mb-1">Collected</p>
          <p className="text-sm font-bold text-green-700">
            ₹{totalCollected.toLocaleString()}
          </p>
        </div>

        {/* Outstanding */}
        <div className="text-center">
          <p className="text-xs text-orange-600 font-medium mb-1">
            Outstanding
          </p>
          <p className="text-sm font-bold text-orange-700">
            ₹{totalOutstanding.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Visits Summary - Compact */}
      <div className="flex items-center justify-center text-xs text-gray-600 bg-gray-50 rounded-lg py-2">
        <CalendarCheck2 className="w-3 h-3 text-blue-600 mr-1" />
        <span className="font-medium text-gray-800">{totalVisits}</span>
        <span className="ml-1">visits this month</span>
      </div>
    </div>
  );
};

export default EarningsCard;

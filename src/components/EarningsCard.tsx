import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { DollarSign, CalendarCheck2 } from "lucide-react";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";

const EarningsCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients } = useSelector((state: RootState) => state.patients);
  const visitsByPatient = useSelector(
    (state: RootState) => state.visits.visits
  );

  // Fetch visits for any patient whose visits aren't loaded yet
  useEffect(() => {
    if (!patients || patients.length === 0) return;
    patients.forEach((patient) => {
      if (!visitsByPatient[patient.id]) {
        dispatch(fetchVisitsAsync(patient.id) as any);
      }
    });
  }, [dispatch, patients, visitsByPatient]);

  const { totalEarnings, totalVisits } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let earningsSum = 0;
    let visitsCount = 0;

    patients.forEach((patient) => {
      const visits = visitsByPatient[patient.id] || [];
      const visitsThisMonth = visits.filter((v) => {
        const d = new Date(v.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      const numVisits = visitsThisMonth.length;
      visitsCount += numVisits;
      earningsSum += numVisits * (patient.chargePerVisit || 0);
    });

    return { totalEarnings: earningsSum, totalVisits: visitsCount };
  }, [patients, visitsByPatient]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Earnings this month
          </p>
          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            ₹{totalEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-full">
          <DollarSign className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <CalendarCheck2 className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-gray-800">{totalVisits}</span>
          visits this month
        </span>
      </div>
    </div>
  );
};

export default EarningsCard;

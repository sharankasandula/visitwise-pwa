import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { RootState } from "../store";
import {
  createVisitAsync,
  deleteVisitAsync,
} from "../store/slices/visitsSlice";

interface CalendarStripProps {
  patientId: string;
}

const CalendarStrip: React.FC<CalendarStripProps> = ({ patientId }) => {
  const dispatch = useDispatch();
  const { visits } = useSelector((state: RootState) => state.visits);
  const patientVisits = visits[patientId] || [];

  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  const isVisitCompleted = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return patientVisits.some(
      (visit) => visit.date === dateStr && visit.completed
    );
  };

  const hasVisitScheduled = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return patientVisits.some((visit) => visit.date === dateStr);
  };

  const handleDateClick = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existingVisit = patientVisits.find((v) => v.date === dateStr);

    if (existingVisit) {
      // If visit exists, delete it (unselect)
      await dispatch(
        deleteVisitAsync({
          patientId,
          visitId: existingVisit.id,
        }) as any
      );
    } else {
      // If no visit exists, create a new one
      await dispatch(
        createVisitAsync({
          patientId,
          date: dateStr,
          completed: false,
          notes: "",
          paymentReceived: 0,
        }) as any
      );
    }
  };

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {days.map((date, index) => {
        const isToday = isSameDay(date, today);
        const isCompleted = isVisitCompleted(date);
        const isScheduled = hasVisitScheduled(date);

        return (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg min-w-[50px] transition-all duration-300 ${
              isCompleted
                ? "bg-green-500 text-white animate-fade-in"
                : isScheduled
                ? "bg-blue-500 text-white"
                : isToday
                ? "bg-primary-100 text-primary-700 border-2 border-primary-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={`${format(date, "EEEE, MMMM d")} - ${
              isCompleted
                ? "Completed"
                : isScheduled
                ? "Scheduled"
                : "Click to schedule"
            }`}
          >
            <span className="text-xs font-medium">{format(date, "EEE")}</span>
            <span className="text-sm font-bold">{format(date, "d")}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CalendarStrip;

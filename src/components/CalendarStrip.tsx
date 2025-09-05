import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { RootState } from "../store";
import {
  createVisitAsync,
  deleteVisitAsync,
} from "../store/slices/visitsSlice";
import VisitModal from "./VisitModal";

interface CalendarStripProps {
  patientId: string;
}

const CalendarStrip: React.FC<CalendarStripProps> = ({ patientId }) => {
  const dispatch = useDispatch();
  const { visits } = useSelector((state: RootState) => state.visits);
  const { patients } = useSelector((state: RootState) => state.patients);

  const patientVisits = visits[patientId] || [];
  const patient = patients.find((p) => p.id === patientId);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existingVisit = patientVisits.find((v) => v.date === dateStr);

    if (existingVisit) {
      // If visit exists and is completed, delete it (unselect)
      if (existingVisit.completed) {
        dispatch(
          deleteVisitAsync({
            patientId,
            visitId: existingVisit.id,
          }) as any
        );
      }
    } else {
      // If no visit exists, open modal to create one
      setSelectedDate(date);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  if (!patient) {
    return <div className="text-muted-foreground">Patient not found</div>;
  }

  return (
    <>
      <div className="flex justify-between overflow-x-auto pb-2">
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
                  ? "bg-primary text-primary-foreground animate-fade-in"
                  : isScheduled
                  ? "ring-2 ring-primary animate-fade-in"
                  : isToday
                  ? "bg-primary/10 text-primary border-2 border-primary/30"
                  : "bg-accent/20 text-muted-foreground"
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

      {/* Visit Modal */}
      <VisitModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedDate={selectedDate}
        patientId={patientId}
        patientName={patient.name}
        defaultCharge={patient.chargePerVisit}
      />
    </>
  );
};

export default CalendarStrip;

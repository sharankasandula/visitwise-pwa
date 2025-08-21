import React, { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar, Lock, PlusCircle } from "lucide-react";
import { Visit } from "../store/slices/visitsSlice";

interface PatientCalendarProps {
  visits: Visit[];
  patientId: string;
  patientName: string;
  defaultCharge: number;
  onAddVisit: (date: Date) => void;
  visitPaymentStatus?: Record<string, "paid" | "unpaid">;
}

const PatientCalendar: React.FC<PatientCalendarProps> = ({
  visits,
  onAddVisit,
  visitPaymentStatus = {},
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Create a map of visits by date for easy lookup
  const visitsByDate = useMemo(() => {
    const map = new Map<string, Visit>();
    visits.forEach((visit) => {
      map.set(visit.date, visit);
    });
    return map;
  }, [visits]);

  // Handle date selection for adding new visits
  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existingVisit = visitsByDate.get(dateStr);

    if (!existingVisit) {
      // Only allow adding visits for today or past dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date <= today) {
        onAddVisit(date);
      }
    }
  };

  // Custom day renderer to show visits and add buttons
  const renderDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const visit = visitsByDate.get(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPastOrToday = date <= today;
    const isToday = isSameDay(date, new Date());
    const isFuture = date > today;

    // Determine the background color and styling based on the date status
    let dayStyles = "";
    let borderStyles = "";
    let textStyles = "";

    if (visit) {
      // Visit completed
      dayStyles = "bg-secondary";
      borderStyles = "";
      textStyles = "text-secondary-foreground";
    } else if (isPastOrToday) {
      // Can add visit
      dayStyles = "";
      borderStyles = "";
      textStyles = "text-foreground";
    } else if (isFuture) {
      // Future date
      dayStyles = " cursor-not-allowed opacity-60";
      borderStyles = "";
      textStyles = "";
    }

    return (
      <div
        className={`relative aspect-square w-full cursor-pointer transition-all duration-200 ${
          isToday ? "ring-2  rounded-lg ring-offset-0" : ""
        }`}
        onClick={() => !isFuture && handleDateClick(date)}
      >
        <div
          className={`h-full w-full rounded-lg border-2 p-1 sm:p-2 flex flex-col items-center justify-center ${dayStyles} ${borderStyles}`}
        >
          {/* Date Number */}
          <div className={`text-xs sm:text-sm font-medium ${textStyles}`}>
            {date.getDate()}
          </div>

          {/* Visit Status or Add Button */}
          {visit ? (
            <div className="flex flex-row  my-1 items-center gap-1">
              {/* Payment Status Indicator */}
              {visitPaymentStatus[visit.id] && (
                <div
                  className={`w-3 h-3 rounded-full ${
                    visitPaymentStatus[visit.id] === "paid"
                      ? "bg-destructive"
                      : "bg-destructive-foreground"
                  }`}
                />
              )}
              {/* <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" /> */}
            </div>
          ) : isPastOrToday ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-5 sm:w-4 sm:h-4 flex items-center justify-center transition-colors">
                <PlusCircle className="w-5 h-5 sm:w-3 sm:h-3" />
                {/* <PlusSquare></PlusSquare> */}
              </div>
            </div>
          ) : isFuture ? (
            <div className="flex flex-col items-center gap-1">
              <Lock className="w-5 h-5 sm:w-4 sm:h-4 " />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Generate calendar days for the current month
  const generateCalendarDays = (): Date[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from the first day of the week (Sunday = 0)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // End at the last day of the week (Saturday = 6)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex flex-row sm:items-center justify-between gap-3 mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Calendar
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg transition-colors"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Month/Year Display */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-medium py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          return (
            <div key={index} className="">
              {renderDay(date)}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex flex-wrap items-center font-extralight justify-center gap-3 sm:gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 bg-secondary rounded"></div>
            <span className="text-xs sm:text-xs">Visit Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-xs">Click to Add Visit</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-xs">Future Date (Locked)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-destructive rounded-full"></div>
            <span className="text-xs sm:text-xs">Paid Visit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-destructive-foreground rounded-full"></div>
            <span className="text-xs sm:text-xs">Unpaid Visit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCalendar;

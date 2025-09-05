import React, { useState } from "react";
import { Calendar, ChevronRight, ChevronDown, Edit } from "lucide-react";
import { format } from "date-fns";
import PatientCalendar from "../PatientCalendar";

interface Visit {
  id: string;
  date: string;
  completed: boolean;
  charge?: number;
  notes?: string;
}

interface VisitsSectionProps {
  visits: Visit[];
  patientId: string;
  patientName: string;
  defaultCharge: number;
  visitPaymentStatus: Record<string, "paid" | "unpaid">;
  onAddVisit: (date: Date) => void;
  onEditVisit: (visit: Visit) => void;
}

const VisitsSection: React.FC<VisitsSectionProps> = ({
  visits,
  patientId,
  patientName,
  defaultCharge,
  visitPaymentStatus,
  onAddVisit,
  onEditVisit,
}) => {
  const [isVisitHistoryCollapsed, setIsVisitHistoryCollapsed] = useState(true);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-400" />
        Visits
      </h3>

      {/* Calendar View */}
      <div className="rounded-lg bg-accent/20 text-card-foreground p-4">
        <PatientCalendar
          visits={visits}
          patientId={patientId}
          patientName={patientName}
          defaultCharge={defaultCharge}
          onAddVisit={onAddVisit}
          visitPaymentStatus={visitPaymentStatus}
        />

        {/* Visits List */}
        <button
          onClick={() => setIsVisitHistoryCollapsed(!isVisitHistoryCollapsed)}
          className="w-full px-4 pt-4 flex items-center justify-between transition-colors"
        >
          <h4 className="font-semibold">Visit History ({visits.length})</h4>
          {isVisitHistoryCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {!isVisitHistoryCollapsed && (
          <div className="divide-y">
            {visits.map((visit) => {
              const isPaid = visitPaymentStatus[visit.id] === "paid";
              return (
                <div
                  key={visit.id}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
                  onClick={() => onEditVisit(visit)}
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(visit.date), "EEEE, dd MMM yyyy")}
                    </p>
                    <p className="text-xs">
                      ₹
                      {visit.charge?.toLocaleString() ||
                        defaultCharge?.toLocaleString() ||
                        0}
                    </p>
                    <p className="text-xs">{visit.notes || "No notes"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {visit.completed && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isPaid
                            ? "bg-success text-success-foreground border border-success"
                            : "bg-warning text-warning-foreground border border-warning"
                        }`}
                      >
                        {isPaid ? "Paid" : "Unpaid"}
                      </span>
                    )}
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
            {visits.length === 0 && (
              <div className="p-8 text-center">
                <img
                  src="/physio_illustration1.png"
                  alt="No Visits"
                  className="w-24 h-24 mx-auto mb-4 opacity-60"
                />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  No visits recorded yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start tracking your patient's progress by adding visits
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitsSection;

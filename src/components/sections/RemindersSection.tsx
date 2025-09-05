import React from "react";
import { MessageCircle, Clock } from "lucide-react";

interface Patient {
  followUpReminderEnabled: boolean;
  followUpReminderDays: number;
}

interface RemindersSectionProps {
  patient: Patient;
}

const RemindersSection: React.FC<RemindersSectionProps> = ({ patient }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-yellow-600" />
        Reminders
      </h3>
      <div className="rounded-lg bg-accent/20 text-card-foreground p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="font-medium">Follow-up Reminder</p>
                <p className="text-sm">
                  Follow up after{" "}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                    {patient.followUpReminderDays} days
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {patient.followUpReminderEnabled ? (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                  On
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
                  Off
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersSection;

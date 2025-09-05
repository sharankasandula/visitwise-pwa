import React, { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";

interface FollowUpReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (days: number) => void;
  patientName: string;
}

const FollowUpReminderModal: React.FC<FollowUpReminderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  patientName,
}) => {
  const [days, setDays] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(days);
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-foreground/50 fixed inset-0 bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-card border border-border text-card-foreground rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-accent/20 text-accent-foreground">
          <div className="flex flex-start space-x-3">
            <div className="p-2 rounded-full">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold pt-1">
                Set Follow-up Reminder
              </h3>
              <p className="text-sm">{patientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-medium mb-2">
              Set a follow-up reminder?
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              Would you like to set a reminder to follow up with this patient
              after they've been archived?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Days Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Follow up after (days)</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Enter number of days"
                  min="1"
                  max="365"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  days
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Reminder will be set for {days} day{days !== 1 ? "s" : ""} from
                today
              </p>
            </div>

            {/* Helper Text */}
            <div className="border bg-muted text-muted-foreground rounded-lg p-3">
              <p className="text-sm">
                💡 This will help you remember to check on the patient's
                progress and potentially reactivate them.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 px-4 py-3 border rounded-lg transition-colors font-medium"
              >
                Skip
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground transition-colors font-medium"
              >
                Set Reminder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FollowUpReminderModal;

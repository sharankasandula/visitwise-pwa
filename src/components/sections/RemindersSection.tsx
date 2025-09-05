import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { UserService } from "../../services/userService";
import {
  ReminderSettings,
  VISIT_REMINDER_OPTIONS,
  PAYMENT_REMINDER_OPTIONS,
  DEFAULT_REMINDER_SETTINGS,
} from "../../types/reminders";
import { Bell, Calendar, CreditCard, Save, Loader2 } from "lucide-react";
import { showSuccess, showError } from "../../utils/toast";

interface RemindersSectionProps {
  patientId: string;
  patientName: string;
}

const RemindersSection: React.FC<RemindersSectionProps> = ({
  patientId,
  patientName,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(
    DEFAULT_REMINDER_SETTINGS
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadReminderSettings();
  }, [user?.id]);

  const loadReminderSettings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const settings = await UserService.getReminderSettings(user.id);
      setReminderSettings(settings);
    } catch (error) {
      console.error("Error loading reminder settings:", error);
      showError("Failed to load reminder settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      await UserService.updateReminderSettings(user.id, reminderSettings);
      showSuccess("Reminder settings saved successfully!");
    } catch (error) {
      console.error("Error saving reminder settings:", error);
      showError("Failed to save reminder settings");
    } finally {
      setSaving(false);
    }
  };

  const updateVisitReminderSetting = (
    field: keyof ReminderSettings["visitReminders"],
    value: any
  ) => {
    setReminderSettings((prev) => ({
      ...prev,
      visitReminders: {
        ...prev.visitReminders,
        [field]: value,
      },
    }));
  };

  const updatePaymentReminderSetting = (
    field: keyof ReminderSettings["paymentReminders"],
    value: any
  ) => {
    setReminderSettings((prev) => ({
      ...prev,
      paymentReminders: {
        ...prev.paymentReminders,
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading reminder settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">
            Reminder Settings
          </h3>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Visit Reminders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h4 className="text-md font-medium text-card-foreground">
              Visit Reminders
            </h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  Enable Visit Reminders
                </p>
                <p className="text-sm text-muted-foreground">
                  Get reminders for upcoming visits with {patientName}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderSettings.visitReminders.enabled}
                  onChange={(e) =>
                    updateVisitReminderSetting("enabled", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {reminderSettings.visitReminders.enabled && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Reminder Frequency
                </label>
                <select
                  value={reminderSettings.visitReminders.frequency}
                  onChange={(e) =>
                    updateVisitReminderSetting("frequency", e.target.value)
                  }
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {VISIT_REMINDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Payment Reminders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h4 className="text-md font-medium text-card-foreground">
              Payment Reminders
            </h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">
                  Enable Payment Reminders
                </p>
                <p className="text-sm text-muted-foreground">
                  Get reminders for outstanding payments from {patientName}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderSettings.paymentReminders.enabled}
                  onChange={(e) =>
                    updatePaymentReminderSetting("enabled", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {reminderSettings.paymentReminders.enabled && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Reminder Frequency
                </label>
                <select
                  value={reminderSettings.paymentReminders.frequency}
                  onChange={(e) =>
                    updatePaymentReminderSetting("frequency", e.target.value)
                  }
                  className="w-full bg-muted border border-border rounded px-3 py-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {PAYMENT_REMINDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersSection;

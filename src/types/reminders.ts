export type VisitReminderFrequency =
  | "daily"
  | "every-other-day"
  | "twice-weekly"
  | "weekly";

export type PaymentReminderFrequency = "daily" | "every-other-day" | "weekly";

export interface ReminderSettings {
  visitReminders: {
    enabled: boolean;
    frequency: VisitReminderFrequency;
  };
  paymentReminders: {
    enabled: boolean;
    frequency: PaymentReminderFrequency;
  };
}

export const VISIT_REMINDER_OPTIONS: {
  value: VisitReminderFrequency;
  label: string;
}[] = [
  { value: "daily", label: "Daily" },
  { value: "every-other-day", label: "Every other day" },
  { value: "twice-weekly", label: "Twice a week" },
  { value: "weekly", label: "Weekly" },
];

export const PAYMENT_REMINDER_OPTIONS: {
  value: PaymentReminderFrequency;
  label: string;
}[] = [
  { value: "daily", label: "Daily" },
  { value: "every-other-day", label: "Every other day" },
  { value: "weekly", label: "Weekly" },
];

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  visitReminders: {
    enabled: true,
    frequency: "daily",
  },
  paymentReminders: {
    enabled: true,
    frequency: "every-other-day",
  },
};

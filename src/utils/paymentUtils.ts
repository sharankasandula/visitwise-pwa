export interface Visit {
  id: string;
  date: string;
  completed: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface PaymentSummary {
  totalEarned: number;
  totalCollected: number;
  totalDue: number;
  unpaidVisits: number;
}

/**
 * Calculates payment summary for a patient
 */
export const calculatePaymentSummary = (
  completedVisits: Visit[],
  payments: Payment[],
  chargePerVisit: number
): PaymentSummary => {
  const totalEarned = completedVisits.length * chargePerVisit;
  const totalCollected = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalDue = totalEarned - totalCollected;

  return {
    totalEarned,
    totalCollected,
    totalDue,
    unpaidVisits: completedVisits.length,
  };
};

/**
 * Calculates which visits are paid for based on payment allocation (oldest visits first)
 */
export const calculateVisitPaymentStatus = (
  completedVisits: Visit[],
  totalCollected: number,
  visitCharge: number
): Record<string, "paid" | "unpaid"> => {
  let remainingPayment = totalCollected;
  const visitPaymentStatus: Record<string, "paid" | "unpaid"> = {};

  // Sort visits by date (oldest first) to allocate payments chronologically
  const sortedVisits = [...completedVisits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sortedVisits.forEach((visit) => {
    if (remainingPayment >= visitCharge) {
      visitPaymentStatus[visit.id] = "paid";
      remainingPayment -= visitCharge;
    } else {
      visitPaymentStatus[visit.id] = "unpaid";
    }
  });

  return visitPaymentStatus;
};

/**
 * Generates a WhatsApp payment reminder message
 */
export const generatePaymentReminderMessage = (
  patientName: string,
  totalDue: number,
  chargePerVisit: number,
  unpaidVisits: number
): string => {
  const outstandingAmount = totalDue.toLocaleString();
  const visitCharge = chargePerVisit.toLocaleString();

  let message = `Hi,\n\n`;
  message += `This is a friendly reminder regarding your outstanding payment.\n\n`;
  message += `📊 Payment Summary:\n`;
  message += `• Outstanding Amount: ₹${outstandingAmount}\n`;
  message += `• Charge per visit: ₹${visitCharge}\n`;
  message += `• Unpaid visits: ${unpaidVisits}\n\n`;
  message += `Please settle your dues at your earliest convenience.\n\n`;
  message += `Thank you for your cooperation!\n`;
  message += `Best regards,\nYour Healthcare Provider`;

  return message;
};

/**
 * Formats phone number for WhatsApp (adds country code if needed)
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  let phoneNumber = phone.replace(/\D/g, "");

  // If phone number doesn't start with country code (91 for India), add it
  if (phoneNumber.length === 10) {
    phoneNumber = "91" + phoneNumber;
  }

  return phoneNumber;
};

/**
 * Opens WhatsApp with payment reminder message
 */
export const sendWhatsAppReminder = (phone: string, message: string): void => {
  if (!phone) {
    alert("Patient phone number is required to send WhatsApp reminder");
    return;
  }

  const formattedPhone = formatPhoneForWhatsApp(phone);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
};

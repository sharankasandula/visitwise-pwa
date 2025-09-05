import React, { useState } from "react";
import {
  DollarSign,
  Calendar,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import WhatsAppIcon from "../ui/icons/WhatsAppIcon";

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
}

interface PaymentsSectionProps {
  totalEarned: number;
  totalCollected: number;
  totalDue: number;
  payments: Payment[];
  patientPhone?: string;
  onRecordPayment: () => void;
  onWhatsAppReminder: () => void;
  onClearDues: () => void;
  onEditPayment: (payment: Payment) => void;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  totalEarned,
  totalCollected,
  totalDue,
  payments,
  patientPhone,
  onRecordPayment,
  onWhatsAppReminder,
  onClearDues,
  onEditPayment,
}) => {
  const [isPaymentHistoryCollapsed, setIsPaymentHistoryCollapsed] =
    useState(true);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-amber-500" />
        Payments
      </h3>

      {/* Payment Summary */}
      <div className="rounded-lg bg-accent/20 text-card-foreground p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs font-medium mb-1">Total Earned</p>
            <p className="text-lg font-bold">₹{totalEarned.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium mb-1">Collected</p>
            <p className="text-lg font-bold">
              ₹{totalCollected.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium mb-1">Outstanding</p>
            <p className="text-lg font-bold">₹{totalDue.toLocaleString()}</p>
          </div>
        </div>

        {/* Payment Actions */}
        <div className="space-y-3">
          <button
            onClick={onRecordPayment}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Record Payment
          </button>
          {patientPhone ? (
            totalDue > 0 ? (
              <button
                onClick={onWhatsAppReminder}
                className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                Send WhatsApp Reminder
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground cursor-not-allowed font-medium flex items-center justify-center gap-2"
                title="No outstanding amount to send reminder for"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                No Outstanding Amount
              </button>
            )
          ) : (
            <button
              disabled
              className="w-full py-2 px-4 bg-accent text-accent-foreground rounded-lg cursor-not-allowed font-medium flex items-center justify-center gap-2"
              title="Phone number required to send WhatsApp reminder"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              Phone Number Required
            </button>
          )}
          {totalDue > 0 && (
            <button
              onClick={onClearDues}
              className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Clear Dues (₹{totalDue.toLocaleString()})
            </button>
          )}
        </div>

        {/* Payment History */}
        <div className="">
          {payments.length > 0 && (
            <button
              onClick={() =>
                setIsPaymentHistoryCollapsed(!isPaymentHistoryCollapsed)
              }
              className="w-full px-4 pt-4 flex items-center justify-between transition-colors"
            >
              <h4 className="font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Payment History ({payments.length})
              </h4>
              {isPaymentHistoryCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          )}

          {!isPaymentHistoryCollapsed && (
            <div className="divide-y">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
                  onClick={() => onEditPayment(payment)}
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(payment.date), "EEEE, dd MMM yyyy")}
                    </p>
                    <p className="text-sm capitalize">
                      {payment.method} • {payment.notes || "No notes"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div className="p-8 text-center">
                  <img
                    src="/physio_illustration1.png"
                    alt="No Payments"
                    className="w-20 h-20 mx-auto mb-4 opacity-60"
                  />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    No payments recorded yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Track payments when you complete visits
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsSection;

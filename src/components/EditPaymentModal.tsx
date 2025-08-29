import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import {
  X,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Edit,
} from "lucide-react";
import { updatePaymentAsync } from "../store/slices/paymentsSlice";
import { AppDispatch } from "../store";
import { showSuccess, showError } from "../utils/toast";
import { Payment } from "../store/slices/paymentsSlice";

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  patientName: string;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({
  isOpen,
  onClose,
  payment,
  patientName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState<"cash" | "upi" | "card" | "other">(
    "cash"
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && payment) {
      setAmount(payment.amount.toString());
      setDate(payment.date);
      setMethod(payment.method);
      setNotes(payment.notes || "");
    }
  }, [isOpen, payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment || !amount || Number(amount) < 1 || !method) return;

    setIsSubmitting(true);

    try {
      await dispatch(
        updatePaymentAsync({
          ...payment,
          amount: Number(amount),
          date,
          method,
          notes: notes.trim(),
        }) as any
      );
      showSuccess(
        "Payment Updated Successfully!",
        `₹${amount} payment has been updated for ${patientName}.`
      );
      onClose();
    } catch (error) {
      console.error("Failed to update payment:", error);
      showError(
        "Failed to Update Payment",
        "Please try again. If the problem persists, contact support."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (payment) {
      setAmount(payment.amount.toString());
      setDate(payment.date);
      setMethod(payment.method);
      setNotes(payment.notes || "");
    }
    onClose();
  };

  const isFormValid = Number(amount) >= 1 && method;

  if (!isOpen || !payment) return null;

  return (
    <div className="bg-foreground/50 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border text-card-foreground rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-accent/10 text-accent-foreground">
          <div className="flex flex-start space-x-3">
            <div className=" p-2 rounded-full">
              <Edit className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg pt-1 font-semibold">Edit Payment</h3>
              <p className="text-sm ">{patientName}</p>
            </div>
          </div>
          <button onClick={handleCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-secondary" />
                <span>Amount</span>
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 ">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border  rounded-lg focus:ring-2  transition-colors"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>Date</span>
              </div>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border  rounded-lg focus:ring-2 "
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4  text-secondary" />
                <span>Payment Method</span>
              </div>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full px-4 py-3 border  rounded-lg"
              required
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4  text-secondary" />
                <span>Notes (Optional)</span>
              </div>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg resize-none"
              placeholder="Add notes about this payment (optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-t-transparent bg-primary text-primary-foreground rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPaymentModal;

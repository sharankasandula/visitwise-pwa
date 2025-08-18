import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { X, DollarSign, Calendar, CreditCard, FileText } from "lucide-react";
import { createPaymentAsync } from "../store/slices/paymentsSlice";
import { AppDispatch } from "../store";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [method, setMethod] = useState<"cash" | "upi" | "card" | "other">(
    "cash"
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setMethod("cash");
      setNotes("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 1 || !method) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createPaymentAsync({
          patientId,
          amount: Number(amount),
          date,
          method,
          notes: notes.trim(),
        }) as any
      );
      onClose();
    } catch (error) {
      console.error("Failed to create payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = Number(amount) >= 1 && method;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Record Payment
              </h3>
              <p className="text-sm text-gray-500">{patientName}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Amount</span>
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Date</span>
              </div>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Payment Method</span>
              </div>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Notes (Optional)</span>
              </div>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Add notes about this payment (optional)"
            />
          </div>

          {/* Helper Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              💡 Tip: payments allocate to oldest visits first.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { X, Calendar, DollarSign, FileText } from "lucide-react";
import { createVisitAsync } from "../store/slices/visitsSlice";
import { AppDispatch } from "../store";

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  patientId: string;
  patientName: string;
  defaultCharge: number;
}

const VisitModal: React.FC<VisitModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  patientId,
  patientName,
  defaultCharge,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [charge, setCharge] = useState(defaultCharge);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && defaultCharge) {
      setCharge(Number(defaultCharge) || 0);
    }
  }, [isOpen, defaultCharge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setIsSubmitting(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      await dispatch(
        createVisitAsync({
          patientId,
          date: dateStr,
          completed: true,
          charge,
          notes: notes.trim(),
        }) as any
      );
      onClose();
      // Reset form
      setCharge(defaultCharge);
      setNotes("");
    } catch (error) {
      console.error("Failed to create visit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCharge(defaultCharge);
    setNotes("");
    onClose();
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Record Visit
              </h3>
              <p className="text-sm text-gray-500">
                {patientName} - {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </p>
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
          {/* Charge Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Visit Charge</span>
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                value={charge}
                onChange={(e) => setCharge(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter charge amount"
                min="0"
                step="0.01"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Default charge: ₹{defaultCharge.toLocaleString()}
            </p>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Visit Notes</span>
              </div>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Add notes about this visit (optional)"
            />
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? "Creating..." : "Confirm Visit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitModal;

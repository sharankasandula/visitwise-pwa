import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { X, Calendar, DollarSign, FileText, Edit } from "lucide-react";
import { updateVisitAsync } from "../store/slices/visitsSlice";
import { AppDispatch } from "../store";
import { showSuccess, showError } from "../utils/toast";
import { Visit } from "../store/slices/visitsSlice";

interface EditVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: Visit | null;
  patientName: string;
}

const EditVisitModal: React.FC<EditVisitModalProps> = ({
  isOpen,
  onClose,
  visit,
  patientName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [charge, setCharge] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && visit) {
      setCharge(visit.charge);
      setNotes(visit.notes || "");
    }
  }, [isOpen, visit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visit) return;

    setIsSubmitting(true);

    try {
      await dispatch(
        updateVisitAsync({
          ...visit,
          charge,
          notes: notes.trim(),
        }) as any
      );
      showSuccess(
        "Visit Updated Successfully!",
        `Visit has been updated for ${patientName} on ${format(
          new Date(visit.date),
          "MMM d, yyyy"
        )}.`
      );
      onClose();
    } catch (error) {
      console.error("Failed to update visit:", error);
      showError(
        "Failed to Update Visit",
        "Please try again. If the problem persists, contact support."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (visit) {
      setCharge(visit.charge);
      setNotes(visit.notes || "");
    }
    onClose();
  };

  if (!isOpen || !visit) return null;

  return (
    <div className="bg-foreground/50 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border text-card-foreground rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-accent/10 text-accent-foreground">
          <div className="flex flex-start space-x-3">
            <div className="p-2 rounded-full">
              <Edit className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold pt-1">Edit Visit</h3>
              <p className="text-sm ">
                {patientName} -{" "}
                {format(new Date(visit.date), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <button onClick={handleCancel} className=" transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Charge Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-secondary" />
                <span>Visit Charge</span>
              </div>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 ">
                ₹
              </span>
              <input
                type="number"
                value={charge}
                onChange={(e) => setCharge(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border rounded-lg  transition-colors"
                placeholder="Enter charge amount"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-secondary" />
                <span>Visit Notes</span>
              </div>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border  rounded-lg focus:ring-2 transition-colors resize-none"
              placeholder="Add notes about this visit (optional)"
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? "Updating..." : "Update Visit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVisitModal;

import React from "react";
import { X, Download, Trash2 } from "lucide-react";
import { MediaItem } from "../../services/mediaService";
import { format } from "date-fns";
import { formatFileSize } from "../../utils/formatUtils";

interface MediaViewerModalProps {
  isOpen: boolean;
  mediaItem: MediaItem | null;
  onClose: () => void;
  onDownload: (mediaItem: MediaItem) => void;
  onDelete: (mediaItem: MediaItem) => void;
  isDeleting?: boolean;
  showPatientInfo?: boolean;
  getPatientName?: (patientId: string) => string;
  closeIcon?: React.ReactNode;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  mediaItem,
  onClose,
  onDownload,
  onDelete,
  isDeleting = false,
  showPatientInfo = false,
  getPatientName,
  closeIcon = <X className="w-6 h-6" />,
}) => {
  if (!isOpen || !mediaItem) return null;

  return (
    <div className="bg-background/90 fixed inset-0 bg-opacity-90 flex items-center justify-center z-[60] p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
        >
          {closeIcon}
        </button>

        {/* Media Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {mediaItem.fileType === "image" ? (
            <img
              src={mediaItem.fileUrl}
              alt={mediaItem.fileName}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <video
              src={mediaItem.fileUrl}
              controls
              className="w-full h-auto max-h-[80vh]"
            />
          )}

          {/* Media Details */}
          <div className="p-4 border-t">
            <div
              className={`flex ${
                showPatientInfo
                  ? "flex-col items-start justify-between"
                  : "items-center justify-between"
              }`}
            >
              <div className="text-left">
                <h4
                  className={`font-medium ${showPatientInfo ? "font-sm" : ""}`}
                >
                  {mediaItem.fileName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(mediaItem.fileSize)} •{" "}
                  {format(
                    new Date(mediaItem.uploadedAt),
                    showPatientInfo ? "EEEE, d/M/yyyy" : "EEEE, MMMM d, yyyy"
                  )}
                </p>
                {showPatientInfo && getPatientName && (
                  <p className="text-sm text-muted-foreground">
                    Patient: {getPatientName(mediaItem.patientId)}
                  </p>
                )}
              </div>
              <div
                className={`flex space-x-2 ${showPatientInfo ? "pt-4" : ""}`}
              >
                <button
                  onClick={() => onDownload(mediaItem)}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download
                </button>
                <button
                  onClick={() => onDelete(mediaItem)}
                  disabled={isDeleting}
                  className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaViewerModal;

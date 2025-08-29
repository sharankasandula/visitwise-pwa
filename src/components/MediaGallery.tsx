import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  Download,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  deleteMediaAsync,
  fetchPatientMediaAsync,
} from "../store/slices/mediaSlice";
import { AppDispatch } from "../store";
import { showSuccess, showError } from "../utils/toast";
import { MediaItem } from "../services/mediaService";
import { format } from "date-fns";

interface MediaGalleryProps {
  isOpen: boolean;
  patientId: string;
  patientName: string;
  onClose: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  isOpen,
  patientId,
  patientName,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { media, loading } = useSelector((state: RootState) => state.media);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const patientMedia = media[patientId] || [];

  useEffect(() => {
    if (patientId && !media[patientId]) {
      dispatch(fetchPatientMediaAsync(patientId) as any);
    }
  }, [patientId, media, dispatch]);

  const handleDelete = async (mediaItem: MediaItem) => {
    if (isDeleting) return;

    setIsDeleting(mediaItem.id);
    try {
      // Extract file path from URL for deletion
      const urlParts = mediaItem.fileUrl.split("/");
      const fileName = urlParts[urlParts.length - 1].split("?")[0];
      const filePath = `patients/${patientId}/media/${fileName}`;

      await dispatch(
        deleteMediaAsync({
          mediaId: mediaItem.id,
          patientId,
          filePath,
        }) as any
      );

      showSuccess(
        "Media Deleted Successfully!",
        `${mediaItem.fileName} has been deleted.`
      );
    } catch (error) {
      console.error("Failed to delete media:", error);
      showError(
        "Failed to Delete Media",
        "Please try again. If the problem persists, contact support."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const openMedia = (mediaItem: MediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  const downloadMedia = (mediaItem: MediaItem) => {
    const link = document.createElement("a");
    link.href = mediaItem.fileUrl;
    link.download = mediaItem.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen || isOpen === undefined || !patientId || !patientName)
    return null;

  if (loading) {
    return (
      <div className="bg-foreground/50 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border text-card-foreground rounded-xl p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading media...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery Modal */}
      <div className="bg-foreground/50 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border text-card-foreground rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-accent/10 text-accent-foreground">
            <div className="flex flex-start space-x-3">
              <div className="p-2 rounded-full">
                <ImageIcon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold pt-1">Media Gallery</h3>
                <p className="text-sm">{patientName}</p>
              </div>
            </div>
            <button onClick={onClose} className="transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {patientMedia.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h4 className="text-lg font-medium text-muted-foreground mb-2">
                  No media uploaded yet
                </h4>
                <p className="text-sm text-muted-foreground">
                  Upload images or videos to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {patientMedia.map((mediaItem) => (
                  <div
                    key={mediaItem.id}
                    className="group relative border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => openMedia(mediaItem)}
                  >
                    {/* Media Preview */}
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      {mediaItem.fileType === "image" ? (
                        <img
                          src={mediaItem.fileUrl}
                          alt={mediaItem.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            src={mediaItem.fileUrl}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadMedia(mediaItem);
                          }}
                          className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                        >
                          <Download className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(mediaItem);
                          }}
                          disabled={isDeleting === mediaItem.id}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Media Info */}
                    <div className="p-3 bg-card">
                      <div className="flex items-center space-x-2 mb-1">
                        {mediaItem.fileType === "image" ? (
                          <ImageIcon className="w-4 h-4 text-blue-500" />
                        ) : (
                          <VideoIcon className="w-4 h-4 text-red-500" />
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(mediaItem.fileSize)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(mediaItem.uploadedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div className="bg-foreground/90 fixed inset-0 bg-opacity-90 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={closeMedia}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media Content */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {selectedMedia.fileType === "image" ? (
                <img
                  src={selectedMedia.fileUrl}
                  alt={selectedMedia.fileName}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.fileUrl}
                  controls
                  className="w-full h-auto max-h-[80vh]"
                />
              )}

              {/* Media Details */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{selectedMedia.fileName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedMedia.fileSize)} •{" "}
                      {selectedMedia.fileType} •{" "}
                      {format(
                        new Date(selectedMedia.uploadedAt),
                        "EEEE, MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadMedia(selectedMedia)}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMedia)}
                      disabled={isDeleting === selectedMedia.id}
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
      )}
    </>
  );
};

export default MediaGallery;

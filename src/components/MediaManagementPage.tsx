import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import {
  fetchAllMediaAsync,
  deleteMediaAsync,
} from "../store/slices/mediaSlice";
import { AppDispatch } from "../store";
import { showSuccess, showError } from "../utils/toast";
import { MediaItem } from "../services/mediaService";
import { format } from "date-fns";
import {
  ArrowLeft,
  Camera,
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Download,
  Search,
  Filter,
} from "lucide-react";

const MediaManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { allMedia, loading } = useSelector((state: RootState) => state.media);
  const { patients } = useSelector((state: RootState) => state.patients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">(
    "all"
  );
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllMediaAsync() as any);
  }, [dispatch]);

  const filteredMedia = allMedia.filter((media) => {
    const matchesSearch =
      media.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patients
        .find((p) => p.id === media.patientId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || media.fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (mediaItem: MediaItem) => {
    if (isDeleting) return;

    setIsDeleting(mediaItem.id);
    try {
      // Extract file path from URL for deletion
      const urlParts = mediaItem.fileUrl.split("/");
      const fileName = urlParts[urlParts.length - 1].split("?")[0];
      const filePath = `patients/${mediaItem.patientId}/media/${fileName}`;

      await dispatch(
        deleteMediaAsync({
          mediaId: mediaItem.id,
          patientId: mediaItem.patientId,
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

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.name || "Unknown Patient";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Media Management</h1>
                <p className="text-muted-foreground">
                  Manage all media files across patients
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by filename or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredMedia.length} of {allMedia.length} media items
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading media...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No media found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Upload some media to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((mediaItem) => (
              <div
                key={mediaItem.id}
                className="group relative border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-card"
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
                <div className="p-3">
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
                  <p className="text-xs font-medium truncate mb-1">
                    {mediaItem.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    {getPatientName(mediaItem.patientId)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(mediaItem.uploadedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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
              <ArrowLeft className="w-6 h-6" />
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
                    <p className="text-sm text-muted-foreground">
                      Patient: {getPatientName(selectedMedia.patientId)}
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
    </div>
  );
};

export default MediaManagementPage;

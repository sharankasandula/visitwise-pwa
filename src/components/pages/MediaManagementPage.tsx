import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  fetchAllMediaAsync,
  deleteMediaAsync,
} from "../../store/slices/mediaSlice";
import { fetchPatients } from "../../store/slices/patientsSlice";
import { AppDispatch } from "../../store";
import { showSuccess, showError } from "../../utils/toast";
import { MediaItem } from "../../services/mediaService";
import { ArrowLeft } from "lucide-react";
import { MediaViewerModal } from "../ui";
import MediaHeader from "../sections/MediaHeader";
import MediaFilters from "../sections/MediaFilters";
import MediaGrid from "../sections/MediaGrid";

const MediaManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allMedia, loading } = useSelector((state: RootState) => state.media);
  const { patients, loading: patientsLoading } = useSelector(
    (state: RootState) => state.patients
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">(
    "all"
  );
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllMediaAsync() as any);
    dispatch(fetchPatients() as any);
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

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.name || "Unknown Patient";
  };

  const downloadMedia = (mediaItem: MediaItem) => {
    // This function should be imported from utils
    const link = document.createElement("a");
    link.href = mediaItem.fileUrl;
    link.download = mediaItem.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MediaHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <MediaFilters
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          filterType={filterType}
          onFilterChange={(e) => setFilterType(e.target.value as any)}
          filteredCount={filteredMedia.length}
          totalCount={allMedia.length}
        />

        {/* Media Grid */}
        <MediaGrid
          mediaItems={filteredMedia}
          loading={loading}
          patientsLoading={patientsLoading}
          searchTerm={searchTerm}
          filterType={filterType}
          onOpenMedia={openMedia}
          onDeleteMedia={handleDelete}
          onDownloadMedia={downloadMedia}
          isDeleting={isDeleting}
          getPatientName={getPatientName}
        />
      </div>

      {/* Media Viewer Modal */}
      <MediaViewerModal
        isOpen={!!selectedMedia}
        mediaItem={selectedMedia}
        onClose={closeMedia}
        onDownload={downloadMedia}
        onDelete={handleDelete}
        isDeleting={isDeleting === selectedMedia?.id}
        showPatientInfo={true}
        getPatientName={getPatientName}
        closeIcon={<ArrowLeft className="w-6 h-6" />}
      />
    </div>
  );
};

export default MediaManagementPage;

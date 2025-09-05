import React from "react";
import { Camera } from "lucide-react";
import { MediaItem as MediaItemType } from "../../services/mediaService";
import { LoadingSpinner } from "../ui";
import MediaItem from "./MediaItem";

interface MediaGridProps {
  mediaItems: MediaItemType[];
  loading: boolean;
  patientsLoading: boolean;
  searchTerm: string;
  filterType: "all" | "image" | "video";
  onOpenMedia: (mediaItem: MediaItemType) => void;
  onDeleteMedia: (mediaItem: MediaItemType) => void;
  onDownloadMedia: (mediaItem: MediaItemType) => void;
  isDeleting: string | null;
  getPatientName: (patientId: string) => string;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  mediaItems,
  loading,
  patientsLoading,
  searchTerm,
  filterType,
  onOpenMedia,
  onDeleteMedia,
  onDownloadMedia,
  isDeleting,
  getPatientName,
}) => {
  if (loading || patientsLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner
          size="md"
          text={`Loading ${loading ? "media" : "patients"}...`}
        />
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {mediaItems.map((mediaItem) => (
        <MediaItem
          key={mediaItem.id}
          mediaItem={mediaItem}
          onOpen={onOpenMedia}
          onDelete={onDeleteMedia}
          onDownload={onDownloadMedia}
          isDeleting={isDeleting === mediaItem.id}
          getPatientName={getPatientName}
        />
      ))}
    </div>
  );
};

export default MediaGrid;

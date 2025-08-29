import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { fetchPatientMediaAsync } from "../store/slices/mediaSlice";
import { AppDispatch } from "../store";
import {
  Camera,
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  Eye,
  Upload,
} from "lucide-react";
import { MediaItem } from "../services/mediaService";

interface MediaPreviewProps {
  patientId: string;
  patientName: string;
  onViewAll: () => void;
  onUpload: () => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  patientId,
  patientName,
  onViewAll,
  onUpload,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { media, loading } = useSelector((state: RootState) => state.media);

  const patientMedia = media[patientId] || [];

  useEffect(() => {
    if (patientId && !media[patientId] && !loading) {
      dispatch(fetchPatientMediaAsync(patientId) as any);
    }
  }, [patientId, media, dispatch, loading]);

  // Use useMemo to compute preview items without causing re-renders
  const previewItems = useMemo(() => {
    return patientMedia.slice(0, 4);
  }, [patientMedia]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5 text-pink-400" />
          Media
        </h3>
        <div className="rounded-lg bg-card border border-border text-card-foreground p-8 text-center">
          <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Camera className="w-5 h-5 text-pink-400" />
        Media
      </h3>

      {patientMedia.length === 0 ? (
        <div className="rounded-lg bg-card border border-border text-card-foreground p-8 text-center">
          <img
            src="/illustrations/physio_illustration1.png"
            alt="No Media"
            className="w-20 h-20 mx-auto mb-4 opacity-60"
          />
          <p className="text-lg font-medium text-muted-foreground mb-2">
            No media uploaded yet
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Upload images or videos to track patient progress
          </p>
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Media
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previewItems.map((mediaItem) => (
              <div
                key={mediaItem.id}
                className="relative aspect-square border border-border rounded-lg overflow-hidden bg-muted"
              >
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
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* File Type Indicator */}
                <div className="absolute top-2 right-2">
                  {mediaItem.fileType === "image" ? (
                    <ImageIcon className="w-4 h-4 text-blue-500 bg-white rounded-full p-0.5" />
                  ) : (
                    <VideoIcon className="w-4 h-4 text-red-500 bg-white rounded-full p-0.5" />
                  )}
                </div>
              </div>
            ))}

            {/* More Items Indicator */}
            {patientMedia.length > 4 && (
              <div className="relative aspect-square border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      +{patientMedia.length - 4}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">More</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onViewAll}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View All ({patientMedia.length})
            </button>
            <button
              onClick={onUpload}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;

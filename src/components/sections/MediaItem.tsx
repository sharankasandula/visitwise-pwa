import React from "react";
import {
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Download,
} from "lucide-react";
import { MediaItem as MediaItemType } from "../../services/mediaService";
import { thumbhashToDataURL } from "../../utils/thumbhashUtils";
import { formatFileSize, downloadMedia } from "../../utils/formatUtils";
import { format } from "date-fns";

interface MediaItemProps {
  mediaItem: MediaItemType;
  onOpen: (mediaItem: MediaItemType) => void;
  onDelete: (mediaItem: MediaItemType) => void;
  onDownload: (mediaItem: MediaItemType) => void;
  isDeleting: boolean;
  getPatientName: (patientId: string) => string;
}

const MediaItem: React.FC<MediaItemProps> = ({
  mediaItem,
  onOpen,
  onDelete,
  onDownload,
  isDeleting,
  getPatientName,
}) => {
  return (
    <div
      className="group relative bg-accent/20 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer media-grid-item"
      onClick={() => onOpen(mediaItem)}
    >
      {/* Media Preview */}
      <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
        {mediaItem.fileType === "image" ? (
          <>
            {/* ThumbHash placeholder */}
            {mediaItem.thumbHash && (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${thumbhashToDataURL(
                    mediaItem.thumbHash
                  )})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(8px)",
                }}
              />
            )}
            {/* Optimized preview image */}
            <img
              src={mediaItem.previewUrl || mediaItem.fileUrl}
              alt={mediaItem.fileName}
              className={`w-full h-full object-cover relative z-10 media-preview ${
                mediaItem.thumbHash ? "" : "loaded"
              }`}
              loading="lazy"
              decoding="async"
              onLoad={(e) => {
                // Hide placeholder when image loads
                const target = e.target as HTMLImageElement;
                target.classList.add("loaded");
                // Remove inline style to allow CSS to take over
                target.style.opacity = "";
              }}
              style={mediaItem.thumbHash ? { opacity: "0" } : {}}
            />
          </>
        ) : (
          <div className="relative w-full h-full">
            {/* Video poster with thumbhash placeholder */}
            {mediaItem.posterUrl && (
              <>
                {mediaItem.thumbHash && (
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage: `url(${thumbhashToDataURL(
                        mediaItem.thumbHash
                      )})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(8px)",
                    }}
                  />
                )}
                <img
                  src={mediaItem.posterUrl}
                  alt={`Poster for ${mediaItem.fileName}`}
                  className={`w-full h-full object-cover relative z-10 media-preview video-poster ${
                    mediaItem.thumbHash ? "" : "loaded"
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.classList.add("loaded");
                    // Remove inline style to allow CSS to take over
                    target.style.opacity = "";
                  }}
                  onError={(e) => {
                    console.error(
                      `Video poster failed to load: ${mediaItem.fileName}`
                    );
                  }}
                  style={mediaItem.thumbHash ? { opacity: "0" } : {}}
                />
              </>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-20">
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
              onDownload(mediaItem);
            }}
            className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          >
            <Download className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(mediaItem);
            }}
            disabled={isDeleting}
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
  );
};

export default MediaItem;

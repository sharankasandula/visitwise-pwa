import { MediaItem } from "../services/mediaService";

/**
 * Format file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Download a media file
 * @param mediaItem - The media item to download
 */
export const downloadMedia = (mediaItem: MediaItem): void => {
  const link = document.createElement("a");
  link.href = mediaItem.fileUrl;
  link.download = mediaItem.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

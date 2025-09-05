import React, { useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import { uploadMediaAsync } from "../../store/slices/mediaSlice";
import { AppDispatch } from "../../store";
import { showSuccess, showError } from "../../utils/toast";
import OptimizedCameraCapture from "../OptimizedCameraCapture";
import UploadOptions from "../forms/UploadOptions";
import FilePreview from "../forms/FilePreview";
import UploadProgress from "../forms/UploadProgress";

interface MediaUploadProps {
  isOpen: boolean;
  patientId: string;
  patientName: string;
  onClose: () => void;
  onUploadComplete?: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  isOpen,
  patientId,
  patientName,
  onClose,
  onUploadComplete,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<"photo" | "video">("photo");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log("Files selected:", files);
    if (files.length > 0) {
      // If we already have files selected, append new ones
      if (selectedFiles.length > 0) {
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        createPreviews(files); // Only create previews for new files
      } else {
        setSelectedFiles(files);
        createPreviews(files);
      }
    }
    // Reset the input so the same file can be selected again if needed
    event.target.value = "";
  };

  const createPreviews = (files: File[]) => {
    const newPreviewUrls: Record<string, string> = {};
    files.forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        try {
          const url = URL.createObjectURL(file);
          newPreviewUrls[file.name] = url;
          console.log(`Created preview URL for ${file.name}:`, url);
        } catch (error) {
          console.error(
            `Failed to create preview URL for ${file.name}:`,
            error
          );
        }
      }
    });
    console.log("New preview URLs:", newPreviewUrls);
    setPreviewUrls((prev) => {
      const updated = { ...prev, ...newPreviewUrls };
      console.log("Updated preview URLs:", updated);
      return updated;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await dispatch(
          uploadMediaAsync({
            file,
            patientId,
          }) as any
        );
      }

      const fileNames = selectedFiles.map((f) => f.name).join(", ");
      showSuccess(
        "Media Uploaded Successfully!",
        `${selectedFiles.length} file(s) (${fileNames}) have been uploaded for ${patientName}.`
      );

      // Clear the selected files and previews after successful upload
      clearSelection();
      onUploadComplete?.();
      onClose();
    } catch (error) {
      console.error("Failed to upload media:", error);
      showError(
        "Failed to Upload Media",
        "Please try again. If the problem persists, contact support."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const openCamera = (mode: "photo" | "video") => {
    setCameraMode(mode);
    setShowCamera(true);
  };

  const clearSelection = () => {
    // Revoke all object URLs to prevent memory leaks
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls({});
  };

  const removeFile = (fileName: string) => {
    const fileToRemove = selectedFiles.find((f) => f.name === fileName);
    if (fileToRemove) {
      const newFiles = selectedFiles.filter((f) => f.name !== fileName);
      setSelectedFiles(newFiles);

      // Revoke the object URL for the removed file
      if (previewUrls[fileName]) {
        URL.revokeObjectURL(previewUrls[fileName]);
        const newPreviewUrls = { ...previewUrls };
        delete newPreviewUrls[fileName];
        setPreviewUrls(newPreviewUrls);
      }
    }
  };

  if (!isOpen || isOpen === undefined || !patientId || !patientName)
    return null;

  return (
    <div className="bg-foreground/50 fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border text-card-foreground rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-accent/20 text-accent-foreground">
          <div className="flex flex-start space-x-3">
            <div className="p-2 rounded-full">
              <Upload className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold pt-1">Upload Media</h3>
              <p className="text-sm">{patientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Options */}
          {selectedFiles.length === 0 && (
            <UploadOptions
              onFilePicker={openFilePicker}
              onCamera={openCamera}
            />
          )}

          {/* File Preview */}
          {selectedFiles.length > 0 && (
            <>
              <FilePreview
                files={selectedFiles}
                previewUrls={previewUrls}
                onRemoveFile={removeFile}
                onAddMore={openFilePicker}
                onClearAll={clearSelection}
              />

              {/* Upload Button */}
              <UploadProgress
                isUploading={isUploading}
                isCompressing={isCompressing}
                compressionProgress={compressionProgress}
                fileCount={selectedFiles.length}
                onUpload={handleUpload}
              />
            </>
          )}

          {/* Hidden Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Optimized Camera Capture */}
      <OptimizedCameraCapture
        isOpen={showCamera}
        mode={cameraMode}
        onCapture={(file) => {
          setSelectedFiles([file]);
          createPreviews([file]);
          setShowCamera(false);
        }}
        onClose={() => setShowCamera(false)}
      />
    </div>
  );
};

export default MediaUpload;

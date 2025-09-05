import React, { useRef, useState } from "react";
import {
  Camera,
  Upload,
  Video,
  Image,
  X,
  FileVideo,
  FileImage,
  Loader2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { uploadMediaAsync } from "../store/slices/mediaSlice";
import { AppDispatch } from "../store";
import { showSuccess, showError } from "../utils/toast";
import {
  getOptimizedCameraConstraints,
  getMediaRecorderOptions,
} from "../utils/mediaOptimization";
import OptimizedCameraCapture from "./OptimizedCameraCapture";

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

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openVideoRecorder = () => {
    videoInputRef.current?.click();
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gallery Upload */}
              <button
                onClick={openFilePicker}
                className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors text-center group"
              >
                <FileImage className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary" />
                <h4 className="font-medium mb-2">Browse Gallery</h4>
                <p className="text-sm text-muted-foreground">
                  Select multiple images or videos from your device
                </p>
              </button>

              {/* Camera */}
              <button
                onClick={() => {
                  setCameraMode("photo");
                  setShowCamera(true);
                }}
                className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors text-center group"
              >
                <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary" />
                <h4 className="font-medium mb-2">Take Photo</h4>
                <p className="text-sm text-muted-foreground">
                  Capture a new photo with camera
                </p>
              </button>

              {/* Video Recording */}
              <button
                onClick={() => {
                  setCameraMode("video");
                  setShowCamera(true);
                }}
                className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors text-center group"
              >
                <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary" />
                <p className="text-sm text-muted-foreground">
                  Record a new video
                </p>
              </button>
            </div>
          )}

          {/* File Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Selected Files ({selectedFiles.length})
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openFilePicker}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    + Add More
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-accent/20 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-3 gap-3">
                  {selectedFiles.map((file, index) => {
                    console.log(
                      `Rendering file ${file.name}, has preview URL:`,
                      !!previewUrls[file.name]
                    );
                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative group"
                      >
                        {/* Preview */}
                        <div className="relative">
                          {previewUrls[file.name] ? (
                            file.type.startsWith("image/") ? (
                              <img
                                src={previewUrls[file.name]}
                                alt={`Preview of ${file.name}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            ) : (
                              <video
                                src={previewUrls[file.name]}
                                controls
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            )
                          ) : (
                            <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                {file.type.startsWith("image/") ? (
                                  <FileImage className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                                ) : (
                                  <FileVideo className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Loading...
                                </p>
                              </div>
                            </div>
                          )}

                          {/* File type icon overlay */}
                          <div className="absolute top-1 left-1">
                            {file.type.startsWith("image/") ? (
                              <FileImage className="w-4 h-4 text-white drop-shadow-lg" />
                            ) : (
                              <FileVideo className="w-4 h-4 text-red-500 drop-shadow-lg" />
                            )}
                          </div>

                          {/* Remove button overlay */}
                          <button
                            onClick={() => removeFile(file.name)}
                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {/* File info */}
                        <div className="mt-1 text-center">
                          <p
                            className="text-xs font-medium truncate"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/25 p-3 rounded-lg">
                <div className="font-medium mb-1">
                  Note: All media will be optimized for faster loading.
                </div>
                <div className="text-xs">
                  Total size:{" "}
                  {formatFileSize(
                    selectedFiles.reduce((total, file) => total + file.size, 0)
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={isUploading || isCompressing}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isCompressing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compressing... {compressionProgress}%</span>
                  </div>
                ) : isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading {selectedFiles.length} file(s)...</span>
                  </div>
                ) : (
                  `Upload ${selectedFiles.length} File${
                    selectedFiles.length > 1 ? "s" : ""
                  }`
                )}
              </button>
            </div>
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

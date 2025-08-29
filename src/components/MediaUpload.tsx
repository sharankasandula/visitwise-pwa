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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<"photo" | "video">("photo");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      createPreview(file);
    }
  };

  const createPreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await dispatch(
        uploadMediaAsync({
          file: selectedFile,
          patientId,
        }) as any
      );

      showSuccess(
        "Media Uploaded Successfully!",
        `${selectedFile.name} has been uploaded for ${patientName}.`
      );

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
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
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
        <div className="flex items-center justify-between p-4 bg-accent/10 text-accent-foreground">
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
          {!selectedFile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Gallery Upload */}
              <button
                onClick={openFilePicker}
                className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors text-center group"
              >
                <FileImage className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary" />
                <h4 className="font-medium mb-2">Browse Gallery</h4>
                <p className="text-sm text-muted-foreground">
                  Select images or videos from your device
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
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Selected File</h4>
                <button
                  onClick={clearSelection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {selectedFile.type.startsWith("image/") ? (
                    <FileImage className="w-8 h-8 text-blue-500" />
                  ) : (
                    <FileVideo className="w-8 h-8 text-red-500" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="mt-4 space-y-3">
                    {selectedFile.type.startsWith("image/") ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        controls
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                      />
                    )}

                    {/* Compression Info */}
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                      <div className="font-medium mb-1">Optimization Info:</div>
                      <div>• Images will be compressed to WebP format</div>
                      <div>• Master: 1280-1600px max, quality 70%</div>
                      <div>• Preview: 320px max, quality 50%</div>
                      <div>• Videos will get optimized poster frames</div>
                      <div>• Estimated compression: 60-80% smaller</div>
                    </div>
                  </div>
                )}
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
                    <span>Uploading...</span>
                  </div>
                ) : (
                  "Upload Media"
                )}
              </button>
            </div>
          )}

          {/* Hidden Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
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
          setSelectedFile(file);
          createPreview(file);
          setShowCamera(false);
        }}
        onClose={() => setShowCamera(false)}
      />
    </div>
  );
};

export default MediaUpload;

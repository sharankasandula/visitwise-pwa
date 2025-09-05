import React from "react";
import { Loader2 } from "lucide-react";

interface UploadProgressProps {
  isUploading: boolean;
  isCompressing: boolean;
  compressionProgress: number;
  fileCount: number;
  onUpload: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  isUploading,
  isCompressing,
  compressionProgress,
  fileCount,
  onUpload,
}) => {
  return (
    <button
      onClick={onUpload}
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
          <span>Uploading {fileCount} file(s)...</span>
        </div>
      ) : (
        `Upload ${fileCount} File${fileCount > 1 ? "s" : ""}`
      )}
    </button>
  );
};

export default UploadProgress;

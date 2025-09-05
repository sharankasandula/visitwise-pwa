import React from "react";
import { Camera, Upload, Video, FileImage } from "lucide-react";

interface UploadOptionsProps {
  onFilePicker: () => void;
  onCamera: (mode: "photo" | "video") => void;
}

const UploadOptions: React.FC<UploadOptionsProps> = ({
  onFilePicker,
  onCamera,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Gallery Upload */}
      <button
        onClick={onFilePicker}
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
        onClick={() => onCamera("photo")}
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
        onClick={() => onCamera("video")}
        className="p-6 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors text-center group"
      >
        <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground group-hover:text-primary" />
        <h4 className="font-medium mb-2">Record Video</h4>
        <p className="text-sm text-muted-foreground">Record a new video</p>
      </button>
    </div>
  );
};

export default UploadOptions;

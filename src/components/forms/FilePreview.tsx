import React from "react";
import { X, FileImage, FileVideo } from "lucide-react";
import { formatFileSize } from "../../utils/formatUtils";

interface FilePreviewProps {
  files: File[];
  previewUrls: Record<string, string>;
  onRemoveFile: (fileName: string) => void;
  onAddMore: () => void;
  onClearAll: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  files,
  previewUrls,
  onRemoveFile,
  onAddMore,
  onClearAll,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Selected Files ({files.length})</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddMore}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            + Add More
          </button>
          <button
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-accent/20 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          {files.map((file, index) => {
            return (
              <div key={`${file.name}-${index}`} className="relative group">
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
                    onClick={() => onRemoveFile(file.name)}
                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* File info */}
                <div className="mt-1 text-center">
                  <p className="text-xs font-medium truncate" title={file.name}>
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
          {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;

import React, { useRef, useState, useEffect } from "react";
import { Camera, Video, X, Loader2, RotateCcw } from "lucide-react";
import {
  getOptimizedCameraConstraints,
  getMediaRecorderOptions,
} from "../utils/mediaOptimization";

interface OptimizedCameraCaptureProps {
  isOpen: boolean;
  onCapture: (file: File) => void;
  onClose: () => void;
  mode: "photo" | "video";
}

const OptimizedCameraCapture: React.FC<OptimizedCameraCaptureProps> = ({
  isOpen,
  onCapture,
  onClose,
  mode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const constraints = getOptimizedCameraConstraints();
      constraints.video!.facingMode = facingMode;

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Failed to start camera:", err);
      setError(err.message || "Failed to access camera");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.webp`, {
            type: "image/webp",
          });
          onCapture(file);
        }
      },
      "image/webp",
      0.8
    );
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    const options = getMediaRecorderOptions();
    const mediaRecorder = new MediaRecorder(streamRef.current, options);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: Blob[] = [];
    setRecordedChunks(chunks);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const file = new File([blob], `video_${Date.now()}.webm`, {
        type: "video/webm",
      });
      onCapture(file);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-2xl max-h-[90vh] bg-black">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-white text-center">
            <h3 className="font-medium">
              {mode === "photo" ? "Take Photo" : "Record Video"}
            </h3>
            <p className="text-sm text-gray-300">
              {mode === "photo"
                ? "Tap to capture"
                : "Tap to start/stop recording"}
            </p>
          </div>

          <button
            onClick={switchCamera}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-white text-center">
              <div>
                <p className="text-lg mb-2">Camera Error</p>
                <p className="text-sm text-gray-300 mb-4">{error}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />

              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                {mode === "photo" ? (
                  <button
                    onClick={capturePhoto}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all"
                  >
                    <Camera className="w-8 h-8 text-black" />
                  </button>
                ) : (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {isRecording ? (
                      <div className="w-6 h-6 bg-white rounded-sm" />
                    ) : (
                      <Video className="w-8 h-8 text-black" />
                    )}
                  </button>
                )}
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm">Recording...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizedCameraCapture;

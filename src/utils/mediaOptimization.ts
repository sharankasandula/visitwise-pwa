import imageCompression from "browser-image-compression";
import { rgbaToThumbHash } from "thumbhash";

export interface OptimizedMedia {
  master: File;
  preview: File;
  thumbHash: string;
  metadata: {
    originalWidth: number;
    originalHeight: number;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  };
}

export interface VideoPoster {
  poster: File;
  thumbHash: string;
}

// Web Worker for image processing
class ImageProcessingWorker {
  private worker: Worker | null = null;

  constructor() {
    try {
      if (
        typeof Worker !== "undefined" &&
        typeof OffscreenCanvas !== "undefined"
      ) {
        this.worker = new Worker(
          new URL("./imageProcessingWorker.js", import.meta.url),
          { type: "module" }
        );

        // Test if the worker is working
        this.worker.onerror = (error) => {
          console.warn(
            "Web Worker initialization error, falling back to main thread:",
            error
          );
          this.worker = null;
        };
      } else {
        console.log(
          "Web Workers or OffscreenCanvas not supported, using main thread processing"
        );
      }
    } catch (error) {
      console.warn(
        "Failed to initialize Web Worker, falling back to main thread:",
        error
      );
      this.worker = null;
    }
  }

  async processImage(file: File): Promise<OptimizedMedia> {
    if (!this.worker || !this.isWorkerHealthy()) {
      // Fallback to main thread if Web Workers not supported or unhealthy
      return this.processImageMainThread(file);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // If worker times out, fall back to main thread
        console.warn(
          "Web Worker timeout, falling back to main thread processing"
        );
        this.processImageMainThread(file).then(resolve).catch(reject);
      }, 30000); // 30 second timeout

      const handleMessage = (event: MessageEvent) => {
        clearTimeout(timeout);
        this.worker?.removeEventListener("message", handleMessage);
        this.worker?.removeEventListener("error", handleError);

        if (event.data.error) {
          console.warn(
            "Web Worker error, falling back to main thread processing:",
            event.data.error
          );
          this.processImageMainThread(file).then(resolve).catch(reject);
        } else {
          resolve(event.data.result);
        }
      };

      const handleError = (error: ErrorEvent) => {
        clearTimeout(timeout);
        this.worker?.removeEventListener("message", handleMessage);
        this.worker?.removeEventListener("error", handleError);
        console.warn(
          "Web Worker error, falling back to main thread processing:",
          error
        );
        this.processImageMainThread(file).then(resolve).catch(reject);
      };

      this.worker.addEventListener("message", handleMessage);
      this.worker.addEventListener("error", handleError);

      try {
        this.worker.postMessage({ file });
      } catch (error) {
        console.warn(
          "Failed to post message to worker, falling back to main thread:",
          error
        );
        clearTimeout(timeout);
        this.processImageMainThread(file).then(resolve).catch(reject);
      }
    });
  }

  private async processImageMainThread(file: File): Promise<OptimizedMedia> {
    const originalSize = file.size;

    // Create master image (1280-1600px max edge, WebP, quality 0.65-0.75)
    const masterOptions = {
      maxWidthOrHeight: 1600,
      useWebWorker: false,
      fileType: "image/webp",
      quality: 0.7,
      maxSizeMB: 1,
    };

    const master = await imageCompression(file, masterOptions);

    // Create preview image (256-320px, WebP, quality 0.5)
    const previewOptions = {
      maxWidthOrHeight: 320,
      useWebWorker: false,
      fileType: "image/webp",
      quality: 0.5,
      maxSizeMB: 0.1,
    };

    const preview = await imageCompression(file, previewOptions);

    // Generate thumbhash from preview
    const thumbHash = await this.generateThumbHash(preview);

    // Get image dimensions
    const { width, height } = await this.getImageDimensions(file);

    return {
      master,
      preview,
      thumbHash,
      metadata: {
        originalWidth: width,
        originalHeight: height,
        originalSize,
        compressedSize: master.size,
        compressionRatio: originalSize / master.size,
      },
    };
  }

  private async generateThumbHash(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // Resize to 32x32 for thumbhash (optimal size)
        canvas.width = 32;
        canvas.height = 32;

        ctx.drawImage(img, 0, 0, 32, 32);
        const imageData = ctx.getImageData(0, 0, 32, 32);

        const hash = rgbaToThumbHash(
          imageData.width,
          imageData.height,
          imageData.data
        );
        // Convert to base64 for storage
        const base64 = btoa(String.fromCharCode(...hash));
        resolve(base64);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private async getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private isWorkerHealthy(): boolean {
    try {
      // Check if worker is still responsive
      return (
        (this.worker !== null && this.worker.readyState === undefined) || // Some workers don't have readyState
        this.worker.readyState === 1
      ); // 1 = ready
    } catch {
      return false;
    }
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Video poster extraction utility
export class VideoPosterExtractor {
  static async extractPoster(videoFile: File): Promise<VideoPoster> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      video.onloadedmetadata = () => {
        // Set canvas size for preview (320x320 max)
        const aspectRatio = video.videoWidth / video.videoHeight;
        let width = 320;
        let height = 320;

        if (aspectRatio > 1) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        // Seek to 1 second or 25% of video duration
        const seekTime = Math.min(1, video.duration * 0.25);
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert to WebP with quality 0.5
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                reject(new Error("Failed to create poster blob"));
                return;
              }

              // Compress the poster
              const compressedPoster = await imageCompression(
                new File([blob], "poster.webp", { type: "image/webp" }),
                {
                  maxWidthOrHeight: 320,
                  useWebWorker: false,
                  fileType: "image/webp",
                  quality: 0.5,
                  maxSizeMB: 0.1,
                }
              );

              // Generate thumbhash
              const thumbHash = await this.generateThumbHash(compressedPoster);

              resolve({
                poster: compressedPoster,
                thumbHash,
              });
            },
            "image/webp",
            0.5
          );
        } catch (error) {
          reject(error);
        }
      };

      video.onerror = () => {
        reject(new Error("Failed to load video for poster extraction"));
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }

  private static async generateThumbHash(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        canvas.width = 32;
        canvas.height = 32;

        ctx.drawImage(img, 0, 0, 32, 32);
        const imageData = ctx.getImageData(0, 0, 32, 32);

        const hash = rgbaToThumbHash(
          imageData.width,
          imageData.height,
          imageData.data
        );
        const base64 = btoa(String.fromCharCode(...hash));
        resolve(base64);
      };
      img.src = URL.createObjectURL(file);
    });
  }
}

// Camera constraints for better video quality
export const getOptimizedCameraConstraints = (): MediaStreamConstraints => {
  return {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 24, max: 30 },
      aspectRatio: { ideal: 16 / 9 },
    },
    audio: true,
  };
};

// MediaRecorder options for better compression
export const getMediaRecorderOptions = (): MediaRecorderOptions => {
  return {
    mimeType: "video/webm;codecs=vp9",
    videoBitsPerSecond: 2500000, // 2.5 Mbps
  };
};

// Export the worker instance
export const imageWorker = new ImageProcessingWorker();

// Debug mode
export const setMediaOptimizationDebug = (enabled: boolean) => {
  if (enabled) {
    console.log("Media optimization debug mode enabled");
    console.log("Web Worker support:", typeof Worker !== "undefined");
    console.log(
      "OffscreenCanvas support:",
      typeof OffscreenCanvas !== "undefined"
    );
    console.log("ImageWorker initialized:", imageWorker !== null);
  }
};

// Cleanup function
export const cleanupMediaOptimization = () => {
  imageWorker.destroy();
};

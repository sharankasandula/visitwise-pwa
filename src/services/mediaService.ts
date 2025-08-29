import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface MediaItem {
  id: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  fileType: "image" | "video";
  fileSize: number;
  uploadedAt: string;
  // Optimized media URLs
  previewUrl?: string;
  posterUrl?: string;
  thumbHash?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    originalSize?: number;
    compressedSize?: number;
    compressionRatio?: number;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Storage provider interface for flexibility
export interface StorageProvider {
  uploadFile(file: File, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
}

// Firebase Storage implementation
export class FirebaseStorageProvider implements StorageProvider {
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      console.log(`File uploaded successfully to ${path}`);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error(`Failed to upload file to ${path}:`, error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  async getFileUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }
}

// Media service class
export class MediaService {
  private storageProvider: StorageProvider;

  constructor(
    storageProvider: StorageProvider = new FirebaseStorageProvider()
  ) {
    this.storageProvider = storageProvider;
  }

  // Set storage provider (useful for switching to R2 or other providers)
  setStorageProvider(provider: StorageProvider) {
    this.storageProvider = provider;
  }

  // Upload media file
  async uploadMedia(
    file: File,
    patientId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<MediaItem> {
    try {
      // Validate file
      if (!file || file.size === 0) {
        throw new Error("Invalid file: File is empty or undefined");
      }

      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        throw new Error(
          "Unsupported file type. Only images and videos are allowed."
        );
      }

      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `media_${timestamp}.${fileExtension}`;

      let fileUrl: string;
      let previewUrl: string | undefined;
      let posterUrl: string | undefined;
      let thumbHash: string | undefined;
      let metadata: any = {};

      if (file.type.startsWith("image/")) {
        // Import optimization utilities dynamically to avoid circular dependencies
        const { imageWorker } = await import("../utils/mediaOptimization");

        // Process image for optimization
        const optimizedImage = await imageWorker.processImage(file);

        // Validate optimization results
        if (!optimizedImage.master || !optimizedImage.preview) {
          throw new Error("Image optimization failed: Missing optimized files");
        }

        // Upload master image
        const masterPath = `patients/${patientId}/media/${fileName}`;
        fileUrl = await this.storageProvider.uploadFile(
          optimizedImage.master,
          masterPath
        );

        // Upload preview image
        const previewFileName = `preview_${fileName.replace(
          /\.[^/.]+$/,
          ".webp"
        )}`;
        const previewPath = `patients/${patientId}/media/${previewFileName}`;
        previewUrl = await this.storageProvider.uploadFile(
          optimizedImage.preview,
          previewPath
        );

        thumbHash = optimizedImage.thumbHash || undefined;
        metadata = {
          ...metadata,
          ...optimizedImage.metadata,
        };
      } else if (file.type.startsWith("video/")) {
        // Import optimization utilities dynamically
        const { VideoPosterExtractor } = await import(
          "../utils/mediaOptimization"
        );

        // Upload original video
        const videoPath = `patients/${patientId}/media/${fileName}`;
        fileUrl = await this.storageProvider.uploadFile(file, videoPath);

        // Extract and upload poster
        const poster = await VideoPosterExtractor.extractPoster(file);

        // Validate poster extraction
        if (!poster.poster) {
          throw new Error(
            "Video poster extraction failed: Missing poster file"
          );
        }

        const posterFileName = `poster_${fileName.replace(
          /\.[^/.]+$/,
          ".webp"
        )}`;
        const posterPath = `patients/${patientId}/media/${posterFileName}`;
        posterUrl = await this.storageProvider.uploadFile(
          poster.poster,
          posterPath
        );

        thumbHash = poster.thumbHash || undefined;
      } else {
        // Fallback for unsupported file types
        const filePath = `patients/${patientId}/media/${fileName}`;
        fileUrl = await this.storageProvider.uploadFile(file, filePath);
      }

      // Create media item in Firestore
      const mediaData: any = {
        patientId,
        fileName: file.name,
        fileUrl,
        fileType: file.type.startsWith("image/")
          ? ("image" as const)
          : ("video" as const),
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        metadata,
      };

      // Only add optional fields if they have values
      if (previewUrl) mediaData.previewUrl = previewUrl;
      if (posterUrl) mediaData.posterUrl = posterUrl;
      if (thumbHash) mediaData.thumbHash = thumbHash;

      const docRef = await addDoc(collection(db, "media"), mediaData);

      return {
        id: docRef.id,
        ...mediaData,
      };
    } catch (error: any) {
      console.error("Error uploading media:", error);

      // Provide more specific error messages
      if (error.code === "storage/unauthorized") {
        throw new Error(
          "Access denied. Please check your permissions or contact support."
        );
      } else if (error.code === "storage/quota-exceeded") {
        throw new Error("Storage quota exceeded. Please contact support.");
      } else if (error.code === "storage/invalid-format") {
        throw new Error(
          "Invalid file format. Please use supported image or video formats."
        );
      } else {
        throw new Error(
          `Failed to upload media file: ${error.message || "Unknown error"}`
        );
      }
    }
  }

  // Get media items for a patient
  async getPatientMedia(patientId: string): Promise<MediaItem[]> {
    try {
      const mediaRef = collection(db, "media");
      const q = query(
        mediaRef,
        where("patientId", "==", patientId),
        orderBy("uploadedAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MediaItem[];
    } catch (error: any) {
      // If the error is about missing index, try without ordering
      if (
        error.code === "failed-precondition" &&
        error.message.includes("index")
      ) {
        console.warn(
          "Composite index not found, fetching without ordering. Please create the index for better performance."
        );
        try {
          const mediaRef = collection(db, "media");
          const q = query(mediaRef, where("patientId", "==", patientId));

          const snapshot = await getDocs(q);
          const mediaItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as MediaItem[];

          // Sort manually in memory
          return mediaItems.sort(
            (a, b) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime()
          );
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          throw new Error("Failed to fetch patient media");
        }
      }

      console.error("Error fetching patient media:", error);
      throw new Error("Failed to fetch patient media");
    }
  }

  // Delete media item
  async deleteMedia(mediaId: string, filePath: string): Promise<void> {
    try {
      // Delete from storage
      await this.storageProvider.deleteFile(filePath);

      // Delete from Firestore
      await deleteDoc(doc(db, "media", mediaId));
    } catch (error) {
      console.error("Error deleting media:", error);
      throw new Error("Failed to delete media file");
    }
  }

  // Get all media items
  async getAllMedia(): Promise<MediaItem[]> {
    try {
      const mediaRef = collection(db, "media");
      const q = query(mediaRef, orderBy("uploadedAt", "desc"));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MediaItem[];
    } catch (error: any) {
      // If the error is about missing index, try without ordering
      if (
        error.code === "failed-precondition" &&
        error.message.includes("index")
      ) {
        console.warn(
          "Composite index not found, fetching without ordering. Please create the index for better performance."
        );
        try {
          const mediaRef = collection(db, "media");
          const snapshot = await getDocs(mediaRef);
          const mediaItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as MediaItem[];

          // Sort manually in memory
          return mediaItems.sort(
            (a, b) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime()
          );
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          throw new Error("Failed to fetch media");
        }
      }

      console.error("Error fetching all media:", error);
      throw new Error("Failed to fetch media");
    }
  }

  // Generate thumbnail for video (placeholder - would need video processing)
  async generateVideoThumbnail(videoFile: File): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.onloadedmetadata = () => {
        canvas.width = 320;
        canvas.height = 180;

        video.currentTime = 1; // Seek to 1 second
        video.onseeked = () => {
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
            resolve(thumbnailUrl);
          }
        };
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }
}

// Export singleton instance
export const mediaService = new MediaService();

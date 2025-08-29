import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mediaService, MediaItem } from "../../services/mediaService";

interface MediaState {
  media: Record<string, MediaItem[]>; // Keyed by patientId
  allMedia: MediaItem[];
  loading: boolean;
  error: string | null;
  uploadProgress: Record<string, number>; // Keyed by file name
}

const initialState: MediaState = {
  media: {},
  allMedia: [],
  loading: false,
  error: null,
  uploadProgress: {},
};

// Upload media for a patient
export const uploadMediaAsync = createAsyncThunk(
  "media/uploadMediaAsync",
  async (
    { file, patientId }: { file: File; patientId: string },
    { rejectWithValue }
  ) => {
    try {
      const mediaItem = await mediaService.uploadMedia(file, patientId);
      return mediaItem;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to upload media");
    }
  }
);

// Fetch media for a specific patient
export const fetchPatientMediaAsync = createAsyncThunk(
  "media/fetchPatientMediaAsync",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const media = await mediaService.getPatientMedia(patientId);
      return { patientId, media };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to fetch patient media");
    }
  }
);

// Fetch all media
export const fetchAllMediaAsync = createAsyncThunk(
  "media/fetchAllMediaAsync",
  async (_, { rejectWithValue }) => {
    try {
      const media = await mediaService.getAllMedia();
      return media;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to fetch all media");
    }
  }
);

// Delete media
export const deleteMediaAsync = createAsyncThunk(
  "media/deleteMediaAsync",
  async (
    {
      mediaId,
      patientId,
      filePath,
    }: { mediaId: string; patientId: string; filePath: string },
    { rejectWithValue }
  ) => {
    try {
      await mediaService.deleteMedia(mediaId, filePath);
      return { mediaId, patientId };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to delete media");
    }
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    clearMedia: (state, action: PayloadAction<string>) => {
      delete state.media[action.payload];
    },
    clearAllMedia: (state) => {
      state.media = {};
      state.allMedia = [];
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUploadProgress: (
      state,
      action: PayloadAction<{ fileName: string; progress: number }>
    ) => {
      state.uploadProgress[action.payload.fileName] = action.payload.progress;
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Media
      .addCase(uploadMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadMediaAsync.fulfilled,
        (state, action: PayloadAction<MediaItem>) => {
          state.loading = false;
          const { patientId, id } = action.payload;

          if (!state.media[patientId]) {
            state.media[patientId] = [];
          }

          // Add to patient's media
          state.media[patientId].unshift(action.payload);

          // Add to all media
          state.allMedia.unshift(action.payload);

          // Clear upload progress
          delete state.uploadProgress[action.payload.fileName];
        }
      )
      .addCase(uploadMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to upload media";
      })

      // Fetch Patient Media
      .addCase(fetchPatientMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPatientMediaAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ patientId: string; media: MediaItem[] }>
        ) => {
          state.loading = false;
          const { patientId, media } = action.payload;
          state.media[patientId] = media;
        }
      )
      .addCase(fetchPatientMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch patient media";
      })

      // Fetch All Media
      .addCase(fetchAllMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllMediaAsync.fulfilled,
        (state, action: PayloadAction<MediaItem[]>) => {
          state.loading = false;
          state.allMedia = action.payload;
        }
      )
      .addCase(fetchAllMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch all media";
      })

      // Delete Media
      .addCase(deleteMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMediaAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ mediaId: string; patientId: string }>
        ) => {
          state.loading = false;
          const { mediaId, patientId } = action.payload;

          // Remove from patient's media
          if (state.media[patientId]) {
            state.media[patientId] = state.media[patientId].filter(
              (m) => m.id !== mediaId
            );
          }

          // Remove from all media
          state.allMedia = state.allMedia.filter((m) => m.id !== mediaId);
        }
      )
      .addCase(deleteMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete media";
      });
  },
});

export const {
  clearMedia,
  clearAllMedia,
  setLoading,
  setError,
  setUploadProgress,
  clearUploadProgress,
} = mediaSlice.actions;

export default mediaSlice.reducer;

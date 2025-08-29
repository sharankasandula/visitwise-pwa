# Media Optimization Features

This document outlines the comprehensive media optimization system implemented in the Visitwise PWA to improve performance, reduce storage costs, and enhance user experience.

## Overview

The media optimization system automatically processes images and videos before upload to:

- Reduce file sizes by 60-80%
- Generate optimized preview images
- Create video poster frames
- Generate thumbhash placeholders for instant loading
- Use Web Workers to keep the UI responsive

## Features

### 1. Image Optimization

#### Master Images

- **Resolution**: 1280-1600px max edge
- **Format**: WebP (modern, efficient format)
- **Quality**: 70% (optimal balance of size vs quality)
- **Target Size**: ~150-300 KB

#### Preview Images

- **Resolution**: 256-320px max edge
- **Format**: WebP
- **Quality**: 50% (sufficient for thumbnails)
- **Target Size**: ~10-25 KB

#### Thumbhash Generation

- **Size**: 32x32 pixels
- **Storage**: ~28-40 bytes per image
- **Usage**: Instant low-fi placeholders while images load

### 2. Video Optimization

#### Recording Constraints

- **Resolution**: 1280x720 ideal, 1920x1080 max
- **Frame Rate**: 24fps ideal, 30fps max
- **Codec**: VP9 (efficient compression)
- **Bitrate**: 2.5 Mbps (balanced quality/size)

#### Poster Frames

- **Extraction**: First frame or 25% into video
- **Format**: WebP, 320px max edge
- **Quality**: 50%
- **Thumbhash**: Generated for instant previews

### 3. Performance Optimizations

#### Web Workers

- Image processing runs in background threads
- UI remains responsive during compression
- Automatic fallback to main thread if workers unavailable

#### Lazy Loading

- `loading="lazy"` on all images
- `decoding="async"` for non-blocking image decoding
- `content-visibility: auto` on grid items

#### Progressive Enhancement

- Thumbhash placeholders show immediately
- Smooth transitions when images load
- Fallback gradients for failed thumbhash generation

## Technical Implementation

### Dependencies

```json
{
  "thumbhash": "^1.0.0",
  "browser-image-compression": "^1.0.0"
}
```

### Key Components

#### MediaOptimization Utility (`src/utils/mediaOptimization.ts`)

- Image processing with Web Workers
- Video poster extraction
- Camera constraints optimization
- MediaRecorder configuration

#### Thumbhash Utilities (`src/utils/thumbhashUtils.ts`)

- Thumbhash encoding/decoding
- Data URL generation
- Fallback placeholder creation

#### OptimizedCameraCapture (`src/components/OptimizedCameraCapture.tsx`)

- Real-time camera capture
- Video recording with optimized settings
- Camera switching support

### Storage Structure

```
patients/
  {patientId}/
    media/
      media_{timestamp}.{ext}          # Master file
      preview_media_{timestamp}.webp   # Preview image
      poster_media_{timestamp}.webp    # Video poster (if video)
```

### Database Schema

```typescript
interface MediaItem {
  id: string;
  patientId: string;
  fileName: string;
  fileUrl: string;           # Master file URL
  previewUrl?: string;       # Preview image URL
  posterUrl?: string;        # Video poster URL
  thumbHash?: string;        # Base64 encoded thumbhash
  fileType: "image" | "video";
  fileSize: number;
  uploadedAt: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    originalSize?: number;
    compressedSize?: number;
    compressionRatio?: number;
  };
}
```

## Usage Examples

### Basic Image Upload

```typescript
import { imageWorker } from "../utils/mediaOptimization";

const optimizedImage = await imageWorker.processImage(file);
// Returns: { master, preview, thumbHash, metadata }
```

### Video Poster Extraction

```typescript
import { VideoPosterExtractor } from "../utils/mediaOptimization";

const poster = await VideoPosterExtractor.extractPoster(videoFile);
// Returns: { poster, thumbHash }
```

### Camera Capture

```typescript
import { getOptimizedCameraConstraints } from "../utils/mediaOptimization";

const constraints = getOptimizedCameraConstraints();
const stream = await navigator.mediaDevices.getUserMedia(constraints);
```

## Performance Benefits

### Storage Reduction

- **Images**: 60-80% smaller files
- **Videos**: Better compression from optimized recording
- **Thumbnails**: 90%+ smaller than full images

### Loading Performance

- **Instant Previews**: Thumbhash placeholders show immediately
- **Progressive Loading**: Images fade in smoothly
- **Lazy Loading**: Only load visible images
- **Background Processing**: Compression doesn't block UI

### Network Efficiency

- **Smaller Uploads**: Faster upload times
- **CDN Friendly**: Optimized formats work better with CDNs
- **Bandwidth Savings**: Reduced data usage for users

## Browser Support

### Required Features

- **Web Workers**: For background image processing
- **Canvas API**: For image manipulation and thumbhash generation
- **WebP Support**: For optimized image formats
- **MediaRecorder API**: For video recording (optional)

### Fallbacks

- **No Web Workers**: Falls back to main thread processing
- **No WebP**: Falls back to JPEG with compression
- **No Canvas**: Falls back to basic image display
- **No MediaRecorder**: Falls back to file upload

## Configuration

### Image Compression Settings

```typescript
const masterOptions = {
  maxWidthOrHeight: 1600,
  useWebWorker: false,
  fileType: "image/webp",
  quality: 0.7,
  maxSizeMB: 1,
};

const previewOptions = {
  maxWidthOrHeight: 320,
  useWebWorker: false,
  fileType: "image/webp",
  quality: 0.5,
  maxSizeMB: 0.1,
};
```

### Video Recording Settings

```typescript
const videoConstraints = {
  width: { ideal: 1280, max: 1920 },
  height: { ideal: 720, max: 1080 },
  frameRate: { ideal: 24, max: 30 },
  aspectRatio: { ideal: 16 / 9 },
};

const recorderOptions = {
  mimeType: "video/webm;codecs=vp9",
  videoBitsPerSecond: 2500000, // 2.5 Mbps
};
```

## Monitoring and Analytics

### Compression Metrics

- Original vs compressed file sizes
- Compression ratios per file type
- Processing time measurements
- Error rates and fallback usage

### Performance Metrics

- Image load times
- Thumbhash generation success rate
- Web Worker availability and usage
- User experience improvements

## Future Enhancements

### Planned Features

- **AVIF Support**: Even better compression for supported browsers
- **Adaptive Quality**: Dynamic quality based on content and device
- **Batch Processing**: Multiple file optimization
- **Cloud Processing**: Server-side optimization for large files

### Research Areas

- **Machine Learning**: Content-aware compression
- **Format Detection**: Automatic best format selection
- **Progressive JPEG**: Better loading experience
- **WebP Animation**: Animated image support

## Troubleshooting

### Common Issues

#### Images Not Compressing

- Check Web Worker support
- Verify file type compatibility
- Check browser console for errors
- **Web Worker Issues**: If you see "Image is not defined" errors, the system automatically falls back to main thread processing

#### Thumbhash Not Generating

- Ensure Canvas API is available
- Check image loading success
- Verify thumbhash library import

#### Camera Not Working

- Check camera permissions
- Verify HTTPS requirement
- Test with different browsers

### Debug Mode

Enable debug logging by setting:

```typescript
import { setMediaOptimizationDebug } from "../utils/mediaOptimization";

setMediaOptimizationDebug(true);
```

Or enable via console:

```typescript
// In browser console
import("../utils/mediaOptimization").then((m) =>
  m.setMediaOptimizationDebug(true)
);
```

## Contributing

When adding new optimization features:

1. Maintain backward compatibility
2. Add comprehensive error handling
3. Include performance benchmarks
4. Update this documentation
5. Test across different devices and browsers

## License

This optimization system is part of the Visitwise PWA and follows the same licensing terms.

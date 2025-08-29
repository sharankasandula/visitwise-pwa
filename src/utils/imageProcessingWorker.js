import imageCompression from 'browser-image-compression';
import { rgbaToThumbHash } from 'thumbhash';

// Web Worker for image processing
self.onmessage = async function (e) {
    try {
        const { file } = e.data;

        if (!file) {
            throw new Error('No file provided');
        }

        const result = await processImage(file);
        self.postMessage({ result });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};

async function processImage(file) {
    const originalSize = file.size;

    // Create master image (1280-1600px max edge, WebP, quality 0.65-0.75)
    const masterOptions = {
        maxWidthOrHeight: 1600,
        useWebWorker: false, // We're already in a worker
        fileType: 'image/webp',
        quality: 0.7,
        maxSizeMB: 1,
    };

    const master = await imageCompression(file, masterOptions);

    // Create preview image (256-320px, WebP, quality 0.5)
    const previewOptions = {
        maxWidthOrHeight: 320,
        useWebWorker: false,
        fileType: 'image/webp',
        quality: 0.5,
        maxSizeMB: 0.1,
    };

    const preview = await imageCompression(file, previewOptions);

    // Generate thumbhash from preview
    const thumbHash = await generateThumbHash(preview);

    // Get image dimensions
    const { width, height } = await getImageDimensions(file);

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

async function generateThumbHash(file) {
    return new Promise(async (resolve) => {
        try {
            // Use createImageBitmap instead of Image in Web Worker
            const bitmap = await createImageBitmap(file);
            const canvas = new OffscreenCanvas(32, 32);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(bitmap, 0, 0, 32, 32);
            const imageData = ctx.getImageData(0, 0, 32, 32);

            const hash = rgbaToThumbHash(imageData.width, imageData.height, imageData.data);
            const base64 = btoa(String.fromCharCode(...hash));

            // Clean up
            bitmap.close();

            resolve(base64);
        } catch (error) {
            console.error('Error generating thumbhash in worker:', error);
            resolve(''); // Return empty string as fallback
        }
    });
}

async function getImageDimensions(file) {
    return new Promise(async (resolve) => {
        try {
            // Use createImageBitmap instead of Image in Web Worker
            const bitmap = await createImageBitmap(file);
            const dimensions = { width: bitmap.width, height: bitmap.height };

            // Clean up
            bitmap.close();

            resolve(dimensions);
        } catch (error) {
            console.error('Error getting image dimensions in worker:', error);
            resolve({ width: 0, height: 0 }); // Return fallback dimensions
        }
    });
}

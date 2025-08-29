import { thumbHashToRGBA } from "thumbhash";

export function thumbhashToDataURL(thumbHash: string): string {
  try {
    // Convert base64 back to Uint8Array
    const hash = Uint8Array.from(atob(thumbHash), (c) => c.charCodeAt(0));

    // Decode thumbhash to RGBA data
    const rgba = thumbHashToRGBA(hash, 32, 32);

    // Create canvas and draw the decoded image
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;

    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(32, 32);

    // Copy RGBA data to ImageData
    for (let i = 0; i < rgba.length; i++) {
      imageData.data[i] = rgba[i];
    }

    ctx.putImageData(imageData, 0, 0);

    // Convert to data URL
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Failed to decode thumbhash:", error);
    // Return a fallback gradient
    return generateFallbackGradient();
  }
}

export function generateFallbackGradient(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;

  const ctx = canvas.getContext("2d")!;

  // Create a simple gradient background
  const gradient = ctx.createLinearGradient(0, 0, 32, 32);
  gradient.addColorStop(0, "#f3f4f6");
  gradient.addColorStop(1, "#e5e7eb");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  return canvas.toDataURL("image/png");
}

export function createBlurredPlaceholder(thumbHash: string): string {
  try {
    const dataURL = thumbhashToDataURL(thumbHash);

    // Create a larger canvas for the blurred version
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;

    const ctx = canvas.getContext("2d")!;

    // Create a temporary image to draw
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 320, 320);
    };
    img.src = dataURL;

    // Apply blur effect
    ctx.filter = "blur(8px)";
    ctx.drawImage(img, 0, 0, 320, 320);

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Failed to create blurred placeholder:", error);
    return generateFallbackGradient();
  }
}

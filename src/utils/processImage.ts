export type AspectFormat = "4:5" | "1:1";

interface ProcessOptions {
  file: File;
  format: AspectFormat;
  padding: number; // 0 to 100 (pixels of white border)
}

const FORMAT_DIMENSIONS: Record<AspectFormat, { width: number; height: number }> = {
  "4:5": { width: 1080, height: 1350 },
  "1:1": { width: 1080, height: 1080 },
};

export async function processImage({ file, format, padding }: ProcessOptions): Promise<Blob> {
  const { width: canvasW, height: canvasH } = FORMAT_DIMENSIONS[format];

  const imageBitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Available area after padding
  const availW = canvasW - padding * 2;
  const availH = canvasH - padding * 2;

  if (availW <= 0 || availH <= 0) {
    // Padding too large — just return white canvas
    return canvasToBlob(canvas);
  }

  // Fit image inside available area
  const scale = Math.min(availW / imageBitmap.width, availH / imageBitmap.height);
  const drawW = imageBitmap.width * scale;
  const drawH = imageBitmap.height * scale;

  // Center
  const x = (canvasW - drawW) / 2;
  const y = (canvasH - drawH) / 2;

  ctx.drawImage(imageBitmap, x, y, drawW, drawH);
  imageBitmap.close();

  return canvasToBlob(canvas);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      0.92
    );
  });
}

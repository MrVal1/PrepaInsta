import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { AspectFormat } from "../utils/processImage";

interface PreviewGridProps {
  files: File[];
  format: AspectFormat;
  padding: number;
  onRemove: (index: number) => void;
}

const FORMAT_DIMENSIONS: Record<AspectFormat, { width: number; height: number }> = {
  "4:5": { width: 1080, height: 1350 },
  "1:1": { width: 1080, height: 1080 },
};

function PreviewCard({
  file,
  format,
  padding,
  onRemove,
}: {
  file: File;
  format: AspectFormat;
  padding: number;
  onRemove: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName] = useState(file.name);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { width: canvasW, height: canvasH } = FORMAT_DIMENSIONS[format];

      // Use a smaller preview size for performance
      const previewScale = 0.3;
      const pW = Math.round(canvasW * previewScale);
      const pH = Math.round(canvasH * previewScale);
      const pPadding = padding * previewScale;

      canvas.width = pW;
      canvas.height = pH;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pW, pH);

      const imageBitmap = await createImageBitmap(file);
      if (cancelled) {
        imageBitmap.close();
        return;
      }

      const availW = pW - pPadding * 2;
      const availH = pH - pPadding * 2;

      if (availW > 0 && availH > 0) {
        const scale = Math.min(availW / imageBitmap.width, availH / imageBitmap.height);
        const drawW = imageBitmap.width * scale;
        const drawH = imageBitmap.height * scale;
        const x = (pW - drawW) / 2;
        const y = (pH - drawH) / 2;
        ctx.drawImage(imageBitmap, x, y, drawW, drawH);
      }

      imageBitmap.close();
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [file, format, padding]);

  const aspectClass = format === "4:5" ? "aspect-[4/5]" : "aspect-square";

  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
      <div className={`${aspectClass} w-full`}>
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
      </div>
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
        <p className="text-xs text-zinc-300 truncate">{fileName}</p>
      </div>
    </div>
  );
}

export default function PreviewGrid({ files, format, padding, onRemove }: PreviewGridProps) {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file, i) => (
        <PreviewCard
          key={`${file.name}-${file.lastModified}-${i}`}
          file={file}
          format={format}
          padding={padding}
          onRemove={() => onRemove(i)}
        />
      ))}
    </div>
  );
}

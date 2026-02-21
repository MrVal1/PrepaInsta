import { Download, RectangleVertical, Square, Loader2, Trash2 } from "lucide-react";
import type { AspectFormat } from "../utils/processImage";

interface ControlPanelProps {
  format: AspectFormat;
  onFormatChange: (f: AspectFormat) => void;
  padding: number;
  onPaddingChange: (p: number) => void;
  onProcess: () => void;
  onClear: () => void;
  imageCount: number;
  processing: boolean;
}

export default function ControlPanel({
  format,
  onFormatChange,
  padding,
  onPaddingChange,
  onProcess,
  onClear,
  imageCount,
  processing,
}: ControlPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
      {/* Format selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400 font-medium">Format</span>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          <button
            onClick={() => onFormatChange("4:5")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
              format === "4:5"
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <RectangleVertical className="h-4 w-4" />
            4:5
          </button>
          <button
            onClick={() => onFormatChange("1:1")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
              format === "1:1"
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Square className="h-3.5 w-3.5" />
            1:1
          </button>
        </div>
      </div>

      {/* Padding slider */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-zinc-400 font-medium whitespace-nowrap">
          Bordure : {padding}px
        </label>
        <input
          type="range"
          min={0}
          max={200}
          step={5}
          value={padding}
          onChange={(e) => onPaddingChange(Number(e.target.value))}
          className="w-36 accent-violet-500"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Clear button */}
      {imageCount > 0 && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Vider
        </button>
      )}

      {/* Process & download */}
      <button
        onClick={onProcess}
        disabled={imageCount === 0 || processing}
        className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {processing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {processing ? "Traitement…" : `Télécharger ZIP (${imageCount})`}
      </button>
    </div>
  );
}

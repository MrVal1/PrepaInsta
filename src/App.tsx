import { useCallback, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Camera } from "lucide-react";
import DropZone from "./components/DropZone";
import ControlPanel from "./components/ControlPanel";
import PreviewGrid from "./components/PreviewGrid";
import { processImage, type AspectFormat } from "./utils/processImage";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<AspectFormat>("4:5");
  const [padding, setPadding] = useState<number>(40);
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    setFiles([]);
  }, []);

  const handleProcess = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);

    try {
      const zip = new JSZip();

      for (let i = 0; i < files.length; i++) {
        const blob = await processImage({
          file: files[i],
          format,
          padding,
        });

        const baseName = files[i].name.replace(/\.[^.]+$/, "");
        zip.file(`${baseName}_instaprep.jpg`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `instaprep_${format.replace(":", "x")}_${files.length}photos.zip`);
    } catch (err) {
      console.error("Processing error:", err);
    } finally {
      setProcessing(false);
    }
  }, [files, format, padding]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-violet-600">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Format Instagram</h1>
            <p className="text-xs text-zinc-500">
              Préparation de photos pour Instagram — 100% côté client
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Control Panel */}
        <ControlPanel
          format={format}
          onFormatChange={setFormat}
          padding={padding}
          onPaddingChange={setPadding}
          onProcess={handleProcess}
          onClear={handleClear}
          imageCount={files.length}
          processing={processing}
        />

        {/* Drop Zone */}
        <DropZone onFilesAdded={handleFilesAdded} />

        {/* Preview Grid */}
        <PreviewGrid
          files={files}
          format={format}
          padding={padding}
          onRemove={handleRemove}
        />
      </main>
    </div>
  );
}

export default App;

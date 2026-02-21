import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export default function DropZone({ onFilesAdded }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors duration-200 ${
        isDragActive
          ? "border-violet-500 bg-violet-500/10"
          : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
      }`}
    >
      <input {...getInputProps()} />
      <ImagePlus className="mx-auto mb-3 h-10 w-10 text-zinc-500" />
      {isDragActive ? (
        <p className="text-violet-400 font-medium">Déposez les images ici…</p>
      ) : (
        <div>
          <p className="text-zinc-300 font-medium">
            Glissez-déposez vos photos ici
          </p>
          <p className="text-zinc-500 text-sm mt-1">
            ou cliquez pour sélectionner (JPG, PNG, WebP)
          </p>
        </div>
      )}
    </div>
  );
}

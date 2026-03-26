import { Upload } from "lucide-react";
import { useState } from "react";

export function UploadImage({
  onImagesChange,
}: {
  onImagesChange: (images: any) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onImagesChange(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    onImagesChange(selectedFiles);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragOver
          ? "border-[var(--icon-1-color)] bg-green-50"
          : "border-[#62FFD5]"
      }`}
      style={{
        background: isDragOver
          ? undefined
          : "linear-gradient(to right, #ffffff 0%, #ffffff 50%, rgba(98, 255, 213, 0.15) 75%, rgba(98, 255, 213, 0.35) 100%)",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("asset-image-input")?.click()}
    >
      <input
        id="asset-image-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="flex items-center justify-center gap-4">
        <Upload className="h-12 w-12 text-icon-1-color" />

        <div>
          <p className="text-lg font-medium text-gray-900">
            Upload or Drag and Drop your Asset images
          </p>

          <p className="text-gray-500 mt-1">
            Supported File Types are .png, .jpeg, .pdf, .csv
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { AppButton } from "@/components/shared/app-button";
import { cn } from "@/lib/utils";
import { FileIcon, ImageIcon, MusicIcon, VideoIcon, X } from "lucide-react";
import * as React from "react";
import { ImageCropper } from "./image-cropper";

interface AppUploaderProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  accept?: string;
  multiple?: boolean;
  type?: "image" | "video" | "audio" | "file";
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  enableCrop?: boolean;
}

export function AppUploader({
  value,
  onChange,
  accept,
  multiple = false,
  type = "file",
  maxSize,
  className,
  disabled,
  enableCrop = false,
}: AppUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [srcToCrop, setSrcToCrop] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);

    if (type === "image" && enableCrop && !multiple) {
      setSrcToCrop(objectUrl);
      return;
    }

    // Simulate upload - in a real app, you'd upload to S3/Cloudinary here
    const newValues = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : value ? [value] : [];
      onChange([...currentValues, ...newValues]);
    } else {
      onChange(newValues[0]);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    // In a real app, you might want to convert base64 to File/Blob and upload
    onChange(croppedImage);
    setSrcToCrop(null);
  };

  const removeFile = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((url) => url !== urlToRemove));
    } else {
      onChange("");
    }
  };

  const currentFiles = Array.isArray(value) ? value : value ? [value] : [];

  const getIcon = () => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-8 w-8 text-muted-foreground" />;
      case "video":
        return <VideoIcon className="h-8 w-8 text-muted-foreground" />;
      case "audio":
        return <MusicIcon className="h-8 w-8 text-muted-foreground" />;
      default:
        return <FileIcon className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("grid gap-4", className)}>
      <div
        className={cn(
          "border-border bg-muted/50 hover:bg-muted/80 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors group",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
        />
        <div className="rounded-full bg-background p-3 shadow-sm group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
            {type} (up to {maxSize ? `${maxSize / 1024 / 1024}MB` : "10MB"})
          </p>
        </div>
      </div>

      {currentFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {currentFiles.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-md border bg-muted shadow-sm"
            >
              {type === "image" ? (
                <img
                  src={url}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : type === "video" ? (
                <video src={url} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-2">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="sr-only">File preview</span>
                </div>
              )}
              <AppButton
                type="button"
                variant="destructive"
                size="icon-xs"
                className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(url);
                }}
              >
                <X className="h-3 w-3" />
              </AppButton>
            </div>
          ))}
        </div>
      )}

      {srcToCrop && (
        <ImageCropper
          imageSrc={srcToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setSrcToCrop(null)}
          circularCrop={true}
        />
      )}
    </div>
  );
}

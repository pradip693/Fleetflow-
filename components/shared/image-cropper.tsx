"use client";

import { AppButton } from "@/components/shared/app-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as React from "react";
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  circularCrop?: boolean;
}

export function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  circularCrop = true,
}: ImageCropperProps) {
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const imgRef = React.useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;

    // Set initial crop to center 80% of the image
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 80,
        },
        1, // Aspect ratio 1:1 for circle
        width,
        height,
      ),
      width,
      height,
    );

    setCrop(initialCrop);
  }

  async function getCroppedImg() {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    // Convert canvas to base64
    const base64Image = canvas.toDataURL("image/jpeg");
    onCropComplete(base64Image);
  }

  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4 bg-muted/30 p-4 rounded-lg overflow-hidden min-h-[300px]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop={circularCrop}
            keepSelection
            className="max-h-[50vh]"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop me"
              onLoad={onImageLoad}
              className="max-w-full h-auto"
            />
          </ReactCrop>
          <p className="text-xs text-muted-foreground italic">
            Drag to move, resize the corners to adjust selection.
          </p>
        </div>

        <DialogFooter>
          <AppButton variant="outline" onClick={onCancel}>
            Cancel
          </AppButton>
          <AppButton onClick={getCroppedImg}>Apply Crop</AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

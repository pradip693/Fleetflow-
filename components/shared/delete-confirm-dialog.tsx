"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, Trash2 } from "lucide-react";

import { AppButton } from "@/components/shared/app-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteConfirmDialogProps {
  onConfirm: () => void | Promise<any>;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  requireConfirmationText?: string;
}

export function DeleteConfirmDialog({
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the record.",
  trigger,
  requireConfirmationText,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmText("");
      setIsPending(false);
    }
  }, [open]);

  const normalizedRequired = requireConfirmationText?.trim();
  const normalizedInput = confirmText.trim();
  const isConfirmed =
    !requireConfirmationText || normalizedInput === normalizedRequired;

  const handleDelete = async () => {
    if (isPending || !isConfirmed) return;

    setIsPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <AppButton variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </AppButton>
          )
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription className="space-y-4">
            {requireConfirmationText ? (
              <div className="bg-destructive/10 border-destructive/20 space-y-1 rounded-lg border p-3">
                <div className="text-destructive flex items-center gap-2 text-sm font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Warning</span>
                </div>
                <p className="text-destructive/90 text-sm font-medium">
                  {description}
                </p>
              </div>
            ) : (
              <span className="block">{description}</span>
            )}

            {requireConfirmationText && (
              <div className="mt-4 space-y-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm-text" className="text-sm font-medium">
                    Please type{" "}
                    <span className="cursor-text font-bold underline select-all text-destructive">
                      {requireConfirmationText.trim()}
                    </span>{" "}
                    to confirm.
                  </Label>
                </div>
                <Input
                  id="confirm-text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={requireConfirmationText.trim()}
                  autoComplete="off"
                  disabled={isPending}
                  className="border-destructive/20 focus-visible:ring-destructive focus:border-destructive"
                />
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AppButton
            onClick={handleDelete}
            isLoading={isPending}
            disabled={!isConfirmed}
            variant="destructive"
            className="gap-2"
          >
            Delete
          </AppButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

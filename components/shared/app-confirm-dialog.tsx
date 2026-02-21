"use client";

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
import { useState } from "react";

interface AppConfirmDialogProps {
  onConfirm: () => void | Promise<any>;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "outline" | "ghost";
}

export function AppConfirmDialog({
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  trigger,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: AppConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={trigger as any} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelText}
          </AlertDialogCancel>
          <AppButton
            onClick={handleConfirm}
            isLoading={isPending}
            variant={variant}
          >
            {confirmText}
          </AppButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

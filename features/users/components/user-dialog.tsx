"use client";

import { AppButton } from "@/components/shared/app-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserDetail } from "../types/user.types";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["general", "premium"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserDialogProps {
  mode: "create" | "edit";
  user?: UserDetail;
  trigger?: React.ReactNode;
}

export function UserDialog({ mode, user, trigger }: UserDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema as any),
    defaultValues: {
      name:
        user?.translations?.find((t) => t.language_code === "en")?.name || "",
      category: (user?.category as any) || "general",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    console.log("Submit user:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          (trigger as React.ReactElement) || (
            <AppButton variant="default">
              {mode === "create" ? "Add User" : "Edit User"}
            </AppButton>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>Enter user details here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" {...form.register("name")} />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.category}>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Select
              value={form.watch("category")}
              onValueChange={(val) => form.setValue("category", val as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[form.formState.errors.category]} />
          </Field>
          <DialogFooter>
            <AppButton type="submit">Save Changes</AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

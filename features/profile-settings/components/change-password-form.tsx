"use client";

import { AppButton } from "@/components/shared/app-button";
import { AppFormField } from "@/components/shared/app-form";
import { useChangePassword } from "../hooks/use-change-password";

export function ChangePasswordForm() {
  const { form, onSubmit, isPending } = useChangePassword();

  return (
    <form id="change-password-form" onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Change Password</h3>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure
          </p>
        </div>

        <div className="grid gap-4">
          <AppFormField
            control={form.control}
            name="currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            required
          />

          <AppFormField
            control={form.control}
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            autoComplete="new-password"
            required
            description="Must be at least 8 characters with uppercase, lowercase, and number"
          />

          <AppFormField
            control={form.control}
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password"
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <AppButton
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isPending}
        >
          Reset
        </AppButton>
        <AppButton type="submit" isLoading={isPending}>
          Change Password
        </AppButton>
      </div>
    </form>
  );
}

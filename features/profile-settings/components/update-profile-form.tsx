"use client";

import { AppButton } from "@/components/shared/app-button";
import { AppFormField } from "@/components/shared/app-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfile } from "../hooks/use-update-profile";

export function UpdateProfileForm() {
  const { form, onSubmit, isPending, user } = useUpdateProfile();
  const avatarUrl = form.watch("avatar");

  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : "";

  return (
    <form id="update-profile-form" onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal details and profile picture
          </p>
        </div>

        <div className="grid gap-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} alt="Profile picture" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <AppFormField
                control={form.control}
                name="avatar"
                label="Profile Picture"
                type="upload"
                uploadProps={{
                  type: "image",
                  accept: "image/*",
                  enableCrop: true,
                }}
                description="Upload a profile picture (JPG, PNG, or GIF)"
              />
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <AppFormField
              control={form.control}
              name="first_name"
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              autoComplete="given-name"
              required
            />

            <AppFormField
              control={form.control}
              name="last_name"
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              autoComplete="family-name"
              required
            />
          </div>

          {/* Email Field */}
          <AppFormField
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            description="This email will be used for account notifications"
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
          Cancel
        </AppButton>
        <AppButton type="submit" isLoading={isPending}>
          Save Changes
        </AppButton>
      </div>
    </form>
  );
}

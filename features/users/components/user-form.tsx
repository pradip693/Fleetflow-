"use client";

import { AppButton } from "@/components/shared/app-button";
import { AppFormField } from "@/components/shared/app-form";
import { AppFormContainer } from "@/components/shared/app-form-container";
import { FormSubsection } from "@/components/shared/form-subsection";
import { useUserForm } from "../hooks/use-user-form";
import { UserFormProps } from "../types/user.types";

import { AppConfirmDialog } from "@/components/shared/app-confirm-dialog";
import { ArrowLeft, RotateCcw } from "lucide-react";

export function UserForm(props: UserFormProps) {
  const { mode } = props;
  const { form, onSubmit, handleReset, isSubmitting, router } =
    useUserForm(props);

  return (
    <AppFormContainer
      title={mode === "add" ? "Create New User" : "Edit User"}
      description={
        mode === "add"
          ? "Fill in the details to create a new user in the system."
          : "Update the user's information and preferences."
      }
      formId="user-form"
      closeHref="/admin/user"
      fullScreen={true}
      actions={
        <>
          <AppButton
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </AppButton>

          <AppConfirmDialog
            title="Reset Form?"
            description="All unsaved changes will be lost. Are you sure you want to reset the form to its initial state?"
            onConfirm={handleReset}
            confirmText="Reset Now"
            variant="destructive"
            trigger={
              <AppButton
                variant="outline"
                type="button"
                disabled={isSubmitting}
                className="gap-2"
              >
                <RotateCcw className="size-4" />
                Reset Form
              </AppButton>
            }
          />

          <AppButton type="submit" form="user-form" isLoading={isSubmitting}>
            {mode === "add" ? "Create User" : "Save Changes"}
          </AppButton>
        </>
      }
    >
      <form
        id="user-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <div className="space-y-6">
          <FormSubsection title="Basic Information" />

          <AppFormField
            control={form.control}
            name="fullName"
            label="Full Name"
            placeholder="John Doe"
            required
            disabled={isSubmitting}
          />

          <AppFormField
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            disabled={isSubmitting}
          />

          <AppFormField
            control={form.control}
            name="password"
            label={mode === "add" ? "Password" : "Change Password (Optional)"}
            type="password"
            placeholder={
              mode === "add"
                ? "Enter a strong password"
                : "Leave blank to keep current"
            }
            required={mode === "add"}
            disabled={isSubmitting}
          />

          <AppFormField
            control={form.control}
            name="bio"
            label="Biography"
            type="textarea"
            placeholder="Tell us about yourself..."
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <AppFormField
              control={form.control}
              name="role"
              label="System Role"
              type="select"
              required
              disabled={isSubmitting}
              options={[
                { label: "Admin", value: "admin" },
                { label: "Editor", value: "editor" },
                { label: "User", value: "user" },
              ]}
            />

            <AppFormField
              control={form.control}
              name="status"
              label="Account Status"
              type="select"
              required
              disabled={isSubmitting}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspended", value: "suspended" },
              ]}
            />
          </div>
        </div>

        <div className="space-y-6">
          <FormSubsection title="Preferences & Media" />

          <AppFormField
            control={form.control}
            name="gender"
            label="Gender"
            type="radio"
            required
            disabled={isSubmitting}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
              { label: "Prefer not to say", value: "secret" },
            ]}
          />

          <AppFormField
            control={form.control}
            name="interests"
            label="Interests"
            type="multiselect"
            placeholder="Select multiple tags..."
            required
            disabled={isSubmitting}
            options={[
              { label: "Technology", value: "tech" },
              { label: "Art", value: "art" },
              { label: "Science", value: "science" },
              { label: "Sports", value: "sports" },
              { label: "Music", value: "music" },
              { label: "Cooking", value: "cooking" },
            ]}
          />

          <div className="grid grid-cols-1 gap-2 pt-2">
            <AppFormField
              control={form.control}
              name="newsletter"
              label="Subscribe to weekly newsletter"
              type="checkbox"
              disabled={isSubmitting}
            />

            <AppFormField
              control={form.control}
              name="notifications"
              label="Enable push notifications"
              type="switch"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AppFormField
              control={form.control}
              name="avatar"
              label="Profile Picture"
              type="upload"
              disabled={isSubmitting}
              uploadProps={{
                type: "image",
                accept: "image/*",
                enableCrop: true,
              }}
            />

            <AppFormField
              control={form.control}
              name="introVideo"
              label="Intro Video"
              type="upload"
              disabled={isSubmitting}
              uploadProps={{
                type: "video",
                accept: "video/*",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AppFormField
              control={form.control}
              name="voiceNote"
              label="Voice Note"
              type="upload"
              disabled={isSubmitting}
              uploadProps={{
                type: "audio",
                accept: "audio/*",
              }}
            />

            <AppFormField
              control={form.control}
              name="document"
              label="CV / Document"
              type="upload"
              disabled={isSubmitting}
              uploadProps={{
                type: "file",
                accept: ".pdf,.doc,.docx",
              }}
            />
          </div>
        </div>
      </form>
    </AppFormContainer>
  );
}

# Form Handling Standards

This document describes the standardized approach to building forms in this boilerplate using `AppFormContainer`, `react-hook-form`, and `zod`.

## 1. The Form Container (`AppFormContainer`)

Always wrap your forms in `components/shared/app-form-container.tsx`. This component ensures a consistent design and user experience.

### Features:
- **Sticky Header**: Displays the form title and description.
- **Sticky Footer**: Places action buttons (Save, Cancel) in a fixed slot.
- **Scrollable Body**: The content area scrolls independently if the form is long.
- **Layout Modes**:
  - Default: A centered card for medium-sized forms.
  - `fullScreen={true}`: Full width/height for complex configurations.

## 2. Using `react-hook-form`

We use the `useForm` hook for state and validation.

```tsx
const form = useForm<FormSchema>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});
```

### Key Practices:
- **Registration**: Use `{...form.register("field")}` for inputs.
- **Validation**: Pass the `zodResolver` to handle validation automatically.
- **Submission**: Use `form.handleSubmit(onSubmit)` to process data only if validation passes.

## 3. Standard Form Structure

Follow this template for a consistent implementation:

```tsx
<AppFormContainer
  title="Edit Profile"
  formId="profile-form"
  actions={
    <Button type="submit" form="profile-form" disabled={isPending}>
      {isPending ? "Saving..." : "Save Changes"}
    </Button>
  }
>
  <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    {/* Form Fields Go Here */}
    <div className="grid gap-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" {...form.register("name")} />
      {form.formState.errors.name && (
        <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
      )}
    </div>
  </form>
</AppFormContainer>
```

## 4. Reusable Inputs

Check `components/ui/` for standardized input types:
- `Input`: Basic text field.
- `Select`: Dropdowns.
- `Checkbox` / `Switch`: Boolean toggles.
- `InputOTP`: For verification codes.
- `ReactCrop`: For image cropping and uploads.

## 5. File Uploads

When handling file uploads (multipart/form-data):
1. Use the `useFormData: true` flag in the `usePostData` hook.
2. Manually append files to a `FormData` object if necessary, or pass the raw file input to the mutation.

## 6. Error Handling

Errors from the API should be caught in the `onError` callback of the mutation hook. You can use `form.setError` to map backend validation errors directly to specific form fields for a better user experience.

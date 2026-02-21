"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { AppSelect } from "@/components/shared/app-select";
import { AppUploader } from "@/components/shared/app-uploader";
import { MultiSelect } from "@/components/shared/multi-select";
import { PasswordInput } from "@/components/shared/password-input";
import { RequiredAsterisk } from "@/components/shared/required-asterisk";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AppFormFieldProps<T extends FieldValues> {
  control: Control<T> | any;
  name: Path<T> | string;
  label: string;
  required?: boolean;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "switch"
    | "radio"
    | "multiselect"
    | "upload";
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  description?: string;
  options?: { label: string; value: string }[];
  uploadProps?: {
    type?: "image" | "video" | "audio" | "file";
    multiple?: boolean;
    accept?: string;
    enableCrop?: boolean;
  };
  onChange?: (val: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  children?: (props: any) => React.ReactNode;
}

export function AppFormField<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
  description,
  options = [],
  uploadProps,
  onChange: customOnChange,
  onFocus: customOnFocus,
  onBlur: customOnBlur,
  children,
}: AppFormFieldProps<T>) {
  const isToggle = type === "checkbox" || type === "switch";

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          orientation={isToggle ? "horizontal" : "vertical"}
          className={cn(
            "w-full",
            isToggle && "items-start gap-4 space-y-0 py-2",
          )}
        >
          {!isToggle && (
            <FieldLabel htmlFor={name as string}>
              {label} {required && <RequiredAsterisk />}
            </FieldLabel>
          )}

          {children ? (
            children({ ...field, fieldState, disabled })
          ) : type === "password" ? (
            <PasswordInput
              {...field}
              id={name as string}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              onFocus={(e) => customOnFocus?.(e)}
              onBlur={(e) => {
                field.onBlur();
                customOnBlur?.(e);
              }}
            />
          ) : type === "textarea" ? (
            <Textarea
              {...field}
              id={name as string}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              onChange={(e) => {
                field.onChange(e);
                customOnChange?.(e.target.value);
              }}
            />
          ) : type === "select" ? (
            <AppSelect
              onValueChange={(val) => {
                field.onChange(val);
                customOnChange?.(val);
              }}
              value={field.value}
              disabled={disabled}
              options={options}
              id={name as string}
              placeholder={placeholder}
            />
          ) : type === "checkbox" ? (
            <>
              <Checkbox
                id={name as string}
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  customOnChange?.(checked);
                }}
                disabled={disabled}
                className="mt-1 shrink-0"
              />
              <div className="flex-1 grid gap-1.5 leading-none">
                <FieldLabel
                  htmlFor={name as string}
                  className="mb-0 cursor-pointer font-medium"
                >
                  {label} {required && <RequiredAsterisk />}
                </FieldLabel>
                {description && (
                  <p className="text-muted-foreground text-xs leading-normal">
                    {description}
                  </p>
                )}
              </div>
            </>
          ) : type === "switch" ? (
            <>
              <Switch
                id={name as string}
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  customOnChange?.(checked);
                }}
                disabled={disabled}
                className="shrink-0"
              />
              <div className="flex-1 grid gap-1.5 leading-none">
                <FieldLabel
                  htmlFor={name as string}
                  className="mb-0 cursor-pointer font-medium"
                >
                  {label} {required && <RequiredAsterisk />}
                </FieldLabel>
                {description && (
                  <p className="text-muted-foreground text-xs leading-normal">
                    {description}
                  </p>
                )}
              </div>
            </>
          ) : type === "radio" ? (
            <RadioGroup
              onValueChange={(val) => {
                field.onChange(val);
                customOnChange?.(val);
              }}
              value={field.value}
              disabled={disabled}
              className="grid gap-2"
            >
              {options.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={`${name}-${opt.value}`}
                  />
                  <FieldLabel
                    htmlFor={`${name}-${opt.value}`}
                    className="mb-0 cursor-pointer font-normal"
                  >
                    {opt.label}
                  </FieldLabel>
                </div>
              ))}
            </RadioGroup>
          ) : type === "multiselect" ? (
            <MultiSelect
              options={options}
              selected={field.value || []}
              onChange={(vals) => {
                field.onChange(vals);
                customOnChange?.(vals);
              }}
              placeholder={placeholder}
              className={cn(fieldState.invalid && "border-destructive")}
            />
          ) : type === "upload" ? (
            <AppUploader
              {...uploadProps}
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                customOnChange?.(val);
              }}
              disabled={disabled}
            />
          ) : (
            <Input
              {...field}
              id={name as string}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              onChange={(e) => {
                field.onChange(e);
                customOnChange?.(e.target.value);
              }}
              onFocus={(e) => customOnFocus?.(e)}
              onBlur={(e) => {
                field.onBlur();
                customOnBlur?.(e);
              }}
            />
          )}

          {!isToggle && description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

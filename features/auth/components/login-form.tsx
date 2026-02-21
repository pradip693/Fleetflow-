"use client";

import { SubmitButton } from "@/features/auth/components/submit-button";
import type { UseLoginFormReturn } from "@/features/auth/hooks/use-login-form";

import { PasswordInput } from "@/components/shared/password-input";
import { RequiredAsterisk } from "@/components/shared/required-asterisk";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * The presentational component for the login form.
 * @param props - The state and handlers provided by the `useLoginForm` hook.
 */

export function LoginForm(props: UseLoginFormReturn) {
  const {
    state,
    handleSubmit,
    isPending,
    isPasswordFocused,
    isPasswordVisible,
    emailLength,
    handleEmailChange,
    handlePasswordFocus,
    handlePasswordBlur,
    handlePasswordVisibilityChange,
    isPasswordError,
  } = props;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mt-2 grid gap-4 sm:gap-5">
        <div className="grid gap-2">
          <Label
            htmlFor="email"
            className={state.fieldErrors?.email ? "text-destructive" : ""}
          >
            Email <RequiredAsterisk />
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            defaultValue="admin@feetflow.in"
            autoComplete="email"
            disabled={isPending}
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={
              state.fieldErrors?.email ? "email-error" : undefined
            }
            onChange={handleEmailChange}
            onFocus={handlePasswordBlur} // Uncover eyes when typing email
          />
          {state.fieldErrors?.email && (
            <p
              id="email-error"
              className="text-destructive animate-in slide-in-from-top-1 text-xs"
              role="alert"
            >
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor="password"
              className={state.fieldErrors?.password ? "text-destructive" : ""}
            >
              Password <RequiredAsterisk />
            </Label>
          </div>

          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            defaultValue="Test@123"
            autoComplete="current-password"
            disabled={isPending}
            aria-invalid={!!state.fieldErrors?.password}
            aria-describedby={
              state.fieldErrors?.password ? "password-error" : undefined
            }
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            onVisibilityChange={handlePasswordVisibilityChange}
          />

          {state.fieldErrors?.password && (
            <p
              id="password-error"
              className="text-destructive animate-in slide-in-from-top-1 text-xs"
              role="alert"
            >
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>
        {!state.success && state.message && (
          <div
            className="bg-destructive/15 text-destructive animate-in zoom-in-95 rounded-md p-3 text-sm font-medium"
            role="alert"
            aria-live="polite"
          >
            {state.message}
          </div>
        )}
        <SubmitButton />
      </form>
    </div>
  );
}

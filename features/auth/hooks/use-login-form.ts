"use client";

import { type ChangeEvent, useState } from "react";

import { useRouter } from "next/navigation";


// Commented out API integration
// import { API_ENDPOINTS } from "@/api/endpoints";
// import usePostData from "@/api/hooks/use-post-data";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { useAuthStore } from "@/stores/auth-store";

// Static credentials
const STATIC_CREDENTIALS = {
  email: "admin@feetflow.in",
  password: "Test@123",
};

/**
 * Manages the complete state and logic for the login form.
 *
 * @returns An object containing state and handlers for the LoginForm component.
 */
export interface UseLoginFormReturn {
  state: {
    success?: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
  };
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;

  isPasswordFocused: boolean;
  isPasswordVisible: boolean;
  isPasswordError: boolean;
  emailLength: number;

  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordFocus: () => void;
  handlePasswordBlur: () => void;
  handlePasswordVisibilityChange: (isVisible: boolean) => void;
}

/**
 * Custom hook to manage Login Form logic.
 */
export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [localError, setLocalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, setIsPending] = useState(false);

  // Commented out API login
  // const { mutate: login, isPending } = usePostData<LoginData, any>({
  //   url: API_ENDPOINTS.AUTH.LOGIN,
  //   onSuccess: (data) => {
  //     setAuth(data, data.access_token);
  //     router.push("/admin");
  //   },
  //   mutationOptions: {
  //     onError: (error: any) => {
  //       setLocalError(error.message || "Login failed");
  //     },
  //   },
  // });

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailLength, setEmailLength] = useState("admin@feetflow.in".length);

  const isPasswordError = !!localError?.toLowerCase().includes("password");

  /**
   * Handles the change event for the email input to track its length for the avatar.
   * @param e - The React change event from the input element.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailLength(e.target.value.length);
  };
  /**
   * Sets the password focus state to true, triggering the avatar's "cover eyes" animation.
   */
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  /**
   * Sets the password focus state to false, triggering the avatar's "uncover eyes" animation.
   */
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  // The total pending state combines the server action and any local transitions.
  const handlePasswordVisibilityChange = (isVisible: boolean) => {
    setIsPasswordVisible(isVisible);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }

    setFieldErrors({});

    // Static login logic
    setIsPending(true);
    setTimeout(() => {
      if (
        email === STATIC_CREDENTIALS.email &&
        password === STATIC_CREDENTIALS.password
      ) {
        // Simulate successful login
        const mockUser = {
          user_id: "1",
          first_name: "Admin",
          last_name: "User",
          email: email,
          role: { name: "admin" },
        };
        const mockToken = "static-access-token-12345";

        setAuth(mockUser, mockToken);
        setIsPending(false);
        router.push("/admin");
      } else {
        setLocalError("Invalid credentials. Use admin@feetflow.in / Test@123");
        setIsPending(false);
      }
    }, 500);

    // Commented out API call
    // login({ email, password });
  };

  return {
    state: {
      success: !localError && Object.keys(fieldErrors).length === 0,
      message: localError || undefined,
      fieldErrors,
    },
    handleSubmit,
    isPending,
    isPasswordFocused,
    isPasswordVisible,
    isPasswordError,
    emailLength,
    handleEmailChange,
    handlePasswordFocus,
    handlePasswordBlur,
    handlePasswordVisibilityChange,
  };
}

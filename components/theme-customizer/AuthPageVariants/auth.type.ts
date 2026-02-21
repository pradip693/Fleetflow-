import { HTMLAttributes } from 'react'
import { z } from 'zod'

export interface AuthLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
}

export interface LoginResponse {
  id: string
  full_name: string
  email: string
  phone_number: string
  access_token: string
}

export type ResetPassFormProps = {
  token: string
}

export type resetPasswordReq = {
  password: string
}

export type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

export const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
  remember: z.string().optional(),
})

export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Please enter your name' }),
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
  remember: z.string().optional(),
})

export const ResetFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(7, { message: 'Password must be at least 7 characters long' }),
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      })
    }
  })

export type ResetPasswordFormData = z.infer<typeof ResetFormSchema>

export const ForgotFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
})

export const EmailVerificationFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces'
      )
      .refine((val) => val.trim() === val, {
        message: 'Password must not start or end with a space',
      })
      .refine((val) => !/\s/.test(val), {
        message: 'Password must not contain whitespace',
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type EmailVerificationFormData = z.infer<
  typeof EmailVerificationFormSchema
>

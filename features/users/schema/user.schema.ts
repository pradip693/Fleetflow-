import { z } from "zod";

const noSpecialCharsRegex = /^[a-zA-Z0-9\s]*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const userFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(noSpecialCharsRegex, "Name cannot contain special characters"),

  email: z.string().trim().email("Invalid email address").toLowerCase(),

  password: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true; // Allow empty if optional (edit mode)
        return passwordRegex.test(val);
      },
      {
        message:
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number",
      },
    ),

  bio: z
    .string()
    .trim()
    .max(500, "Bio must be less than 500 characters")
    .optional(),

  role: z
    .string()
    .min(1, "Please select a role")
    .refine(
      (val) => ["admin", "editor", "user"].includes(val),
      "Invalid role selected",
    ),

  status: z
    .string()
    .min(1, "Please select a status")
    .refine(
      (val) => ["active", "inactive", "suspended"].includes(val),
      "Invalid status",
    ),

  gender: z
    .string()
    .min(1, "Please select gender")
    .refine(
      (val) => ["male", "female", "other", "secret"].includes(val),
      "Invalid gender option",
    ),

  interests: z
    .array(z.string())
    .min(1, "Please select at least one interest")
    .max(5, "You can select up to 5 interests"),

  newsletter: z.boolean(),

  notifications: z.boolean(),

  avatar: z.string().optional(),

  introVideo: z.string().optional(),

  voiceNote: z.string().optional(),

  document: z.string().optional(),
});

export type UserFormSchemaType = z.infer<typeof userFormSchema>;

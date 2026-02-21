export interface UserTranslation {
  id: string;
  language_code: string;
  name: string;
  created_at: string;
}

export interface UserDetail {
  reciter_id: string;
  category: string;
  translations: UserTranslation[];
  created_at: string;
}

export type UserCategory = "all" | "general" | "premium";

export interface UserFormValues {
  fullName: string;
  email: string;
  password?: string;
  bio?: string;
  role: string;
  status: string;
  gender: string;
  interests: string[];
  newsletter: boolean;
  notifications: boolean;
  avatar?: string;
  introVideo?: string;
  voiceNote?: string;
  document?: string;
}

export interface UserFormProps {
  mode: "add" | "edit";
  initialData?: any;
  userId?: string;
}

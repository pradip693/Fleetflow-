export interface ProfileUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  role: {
    name: string;
  };
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

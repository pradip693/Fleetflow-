export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: {
    name: string;
  };
}

export interface LoginData {
  user_id: string;
  first_name: string;
  last_name: string;
  access_token: string;
  email: string;
  role: {
    name: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  email_status: string;
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
}

export interface UsersResponse {
  total: number;
  users: User[];
}

export interface SmtpInfo {
  host: string;
  port: string;
  sender: string;
  account: string;
  web_mailbox: string;
}

export interface ApiErrorResponse {
  error: string;
}

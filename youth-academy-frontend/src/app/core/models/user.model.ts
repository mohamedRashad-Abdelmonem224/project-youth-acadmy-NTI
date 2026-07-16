export type UserRole = 'coach' | 'scout' | 'player' | 'viewer' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  status: string;
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

import { ID } from "@shared/global.types";

// User Model (matches backend IUser)
export interface User {
  _id: ID;
  name: string;
  email: string;
  avatar?: string;
  morningMotivation: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth DTOs
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  morningMotivation?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth Context State
export interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth Actions
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export type AuthContextValue = AuthContextState & AuthActions;

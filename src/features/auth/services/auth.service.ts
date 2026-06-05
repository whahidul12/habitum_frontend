import api, { handleApiError } from "@services/api";
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@features/auth/types/auth.types";

/**
 * Login with email and password
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<{ user: User }> => {
  try {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  updates: Partial<Pick<User, "name" | "morningMotivation">>,
): Promise<{ user: User }> => {
  try {
    const response = await api.patch<{ user: User }>("/auth/profile", updates);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

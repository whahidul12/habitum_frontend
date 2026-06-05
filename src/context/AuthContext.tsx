import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authService from "@features/auth/services/auth.service";
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthContextValue,
} from "@features/auth/types/auth.types";

// Create Auth Context
export const AuthContext = createContext<AuthContextValue | null>(null);

// Custom hook to use Auth Context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    authService
      .getCurrentUser()
      .then((response) => {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      })
      .catch(() => {
        // Token is invalid, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /**
   * Login user with credentials
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    const response = await authService.login(credentials);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    setToken(response.token);
    setUser(response.user);
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterData): Promise<void> => {
    const response = await authService.register(data);

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    setToken(response.token);
    setUser(response.user);
  };

  /**
   * Logout user and clear storage
   */
  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  /**
   * Update user data in state and storage
   */
  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    // Optimistically update UI
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Sync with backend if updating allowed fields
    if (updates.name !== undefined || updates.morningMotivation !== undefined) {
      try {
        const response = await authService.updateProfile({
          name: updates.name,
          morningMotivation: updates.morningMotivation,
        });
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      } catch (error) {
        // Revert on error
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        throw error;
      }
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading: isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

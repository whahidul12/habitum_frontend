import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import { AuthContextValue } from "@features/auth/types/auth.types";

/**
 * Custom hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

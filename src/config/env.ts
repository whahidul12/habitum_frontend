// Environment configuration

interface EnvConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export const env: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

import { useState, FormEvent, ChangeEvent } from "react";
import { useAuth } from "@features/auth/hooks/useAuth";
import { LoginCredentials } from "@features/auth/types/auth.types";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const DEMO_CREDENTIALS = {
  email: "whahid@gmail.com",
  password: "whahid123",
};

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const { login } = useAuth();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAutofill = () => {
    setCredentials({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(credentials);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-dashed border-indigo-500/30 rounded-xl p-4 text-center space-y-2">
        <p className="text-xs font-medium text-indigo-600/80 dark:text-indigo-400/90 uppercase tracking-wider">
          Recruiter Testing Mode
        </p>
        <button
          type="button"
          onClick={handleAutofill}
          className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-semibold text-sm border border-indigo-200 dark:border-indigo-800 rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/50 transition-all duration-200 active:scale-[0.98]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Autofill Demo Credentials
        </button>
      </div>
    </form>
  );
}

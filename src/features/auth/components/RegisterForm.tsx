import { useState, FormEvent, ChangeEvent } from "react";
import { useAuth } from "@features/auth/hooks/useAuth";
import { RegisterData } from "@features/auth/types/auth.types";

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function RegisterForm({
  onSuccess,
  onError,
}: RegisterFormProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    morningMotivation: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (formData.password.length < 6) {
      const errorMessage = "Password must be at least 6 characters";
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    if (formData.name.length < 2) {
      const errorMessage = "Name must be at least 2 characters";
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="label">Name</label>
        <input
          className="input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          required
        />
      </div>

      {error && (
        <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full py-3"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

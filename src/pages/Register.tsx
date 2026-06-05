import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useTheme } from "@context/ThemeContext";
import RegisterForm from "@features/auth/components/RegisterForm";

export default function Register() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegisterSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <button
        onClick={toggle}
        className="fixed top-4 right-4 p-2.5 rounded-xl glass"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles size={18} />
          </div>
          <span className="font-semibold text-lg">AI Habit Tracker</span>
        </Link>

        <div className="card p-7">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted mt-1">
            Free forever. Takes 30 seconds.
          </p>

          <RegisterForm onSuccess={handleRegisterSuccess} />

          <div className="text-center mt-5 text-sm text-soft">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 dark:text-brand-300 font-medium"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

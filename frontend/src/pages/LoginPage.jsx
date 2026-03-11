import { useState } from "react";
import { login } from "../api";
import toast from "react-hot-toast";

export default function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await login(email, password);
      toast.success("Logged in successfully!");
      onLogin(data.token);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">🔗 LinkNest</h1>
          <p className="text-textSecondary">Personal Link Management System</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl p-8 border border-border shadow-lg"
        >
          <h2 className="text-xl font-semibold text-textPrimary mb-6">Admin Sign In</h2>

          <div className="mb-4">
            <label className="block text-textSecondary text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-accent transition-colors"
              placeholder="admin@linknest.com"
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-textSecondary text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-primary border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full mt-3 text-textSecondary hover:text-textPrimary text-sm py-2 transition-colors"
            >
              ← Back to Dashboard
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

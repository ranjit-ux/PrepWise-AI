import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import logo from "../assets/favicon.svg";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(79,142,247,0.06) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-6">
            <img src={logo} alt="Logo" className="w-6 h-6" />
            <span className="font-bold text-[var(--text)]">PrepWise <span className="text-[var(--blue)]">AI</span></span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mb-1.5">Welcome back</h1>
          <p className="text-sm text-[var(--text-2)]">Sign in to continue your interview prep</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7 border space-y-4"
          style={{ background: "var(--bg-1)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Email */}
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 font-medium">Email</label>
            <div className="flex items-center gap-2.5 bg-[var(--bg)] border border-white/[0.08] rounded-xl px-3 h-11 focus-within:border-[var(--blue)]/50 transition-colors">
              <svg className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-transparent flex-1 text-sm text-[var(--text)] placeholder-[var(--text-3)] outline-none focus:outline-none focus:ring-0 focus:border-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 font-medium">Password</label>
            <div className="flex items-center gap-2.5 bg-[var(--bg)] border border-white/[0.08] rounded-xl px-3 h-11 focus-within:border-[var(--blue)]/50 transition-colors">
              <svg className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                placeholder="Your password"
                className="bg-transparent flex-1 text-sm text-[var(--text)] placeholder-[var(--text-3)] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-11 cursor-pointer rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            style={{ background: "linear-gradient(135deg, var(--blue), var(--indigo))", boxShadow: "0 0 20px rgba(79,142,247,0.25) " }}
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <p className="text-xs text-[var(--text-3)] text-center pt-1">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[var(--blue)] hover:text-blue-300 transition-colors no-underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
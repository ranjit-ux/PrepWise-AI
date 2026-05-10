import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import logo from '../assets/favicon.svg';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    try {
      setLoading(true);
      await registerUser({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-6">
            <img src={logo} alt="Logo" className='h-6 w-6' />
            <span className="font-bold text-[var(--text)]">PrepWise <span className="text-[var(--blue)]">AI</span></span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mb-1.5">Create your account</h1>
          <p className="text-sm text-[var(--text-2)]">Start acing your interviews today</p>
        </div>

        <div
          className="rounded-2xl p-7 border space-y-4"
          style={{ background: "var(--bg-1)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Name */}
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 font-medium">Full name</label>
            <div className="flex items-center gap-2.5 bg-[var(--bg)] border border-white/[0.08] rounded-xl px-3 h-11 focus-within:border-[var(--blue)]/50 transition-colors">
              <svg className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <input
                placeholder="John Sharma"
                className="bg-transparent flex-1 text-sm text-[var(--text)] placeholder-[var(--text-3)] outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 font-medium">Email</label>
            <div className="flex items-center gap-2.5 bg-[var(--bg)] border border-white/[0.08] rounded-xl px-3 h-11 focus-within:border-[var(--blue)]/50 transition-colors">
              <svg className="w-3.5 h-3.5 text-[var(--text-3)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-transparent flex-1 text-sm text-[var(--text)] placeholder-[var(--text-3)] outline-none"
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
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                placeholder="Min. 6 characters"
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
            onClick={handleRegister}
            disabled={loading}
            className="w-full h-11 cursor-pointer rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            style={{ background: "linear-gradient(135deg, #059669, #34D399)", boxShadow: "0 0 20px rgba(52,211,153,0.2)" }}
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Creating account…" : "Create account →"}
          </button>

          <p className="text-xs text-[var(--text-3)] text-center pt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--blue)] hover:text-blue-300 transition-colors no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
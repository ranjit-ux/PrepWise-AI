import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/favicon.svg";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isInterview = pathname.includes("/interview-live");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (isInterview) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between transition-all duration-300"
      style={{
        width: "min(900px, calc(100vw - 48px))",
        padding: "12px 20px",
        borderRadius: 16,
        backdropFilter: "blur(20px)",
        background: scrolled ? "rgba(6,9,16,0.88)" : "rgba(12,17,32,0.5)",
        border: "1px solid",
        borderColor: scrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <img src={logo} alt="Logo" className="h-5 w-5" />
        <span className="text-sm font-bold tracking-tight text-[var(--text)]">
          PrepWise <span className="text-[var(--blue)]">AI</span>
        </span>
      </Link>

      {/* Center links */}
      <div className="flex gap-1 hidden sm:flex">
        {["Features", "Questions", "Pricing"].map((item) => (
          <a
            key={item}
            href="#"
            className="px-3 py-1.5 rounded-lg text-[13px] text-[var(--text-2)] hover:text-[var(--text)] hover:bg-white/5 transition-all no-underline"
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className="text-[13px] text-[var(--text-2)] hover:text-[var(--text)] no-underline px-3 py-1.5 transition-colors"
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost text-xs px-3 py-1.5 rounded-lg">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-[13px] text-[var(--text-2)] hover:text-[var(--text)] no-underline px-3 py-1.5 transition-colors">
              Sign in
            </Link>
            <Link to="/interview-demo" className="no-underline">
              <button className="btn btn-primary text-xs px-4 py-2 rounded-lg">
                Try Free →
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
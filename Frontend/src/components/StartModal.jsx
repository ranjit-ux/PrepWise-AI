import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TYPES = [
  {
    id: "dsa",
    icon: "⬡",
    label: "DSA Round",
    desc: "Arrays, trees, graphs & dynamic programming",
    tags: ["45 min", "3 questions", "Voice + Code"],
    active: true,
    route: "/interview-live",
    color: "#4F8EF7",
    glow: "rgba(79,142,247,0.2)",
  },
  {
    id: "system",
    icon: "◈",
    label: "System Design",
    desc: "Scale distributed systems end to end",
    tags: ["60 min", "2 scenarios", "Coming soon"],
    active: false,
    color: "#9B6EFA",
    glow: "rgba(155,110,250,0.2)",
  },
  {
    id: "hr",
    icon: "◎",
    label: "Behavioral Round",
    desc: "STAR method, leadership & culture fit",
    tags: ["30 min", "5 questions", "Coming soon"],
    active: false,
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.2)",
  },
];

export default function StartModal({ close }) {
  const navigate = useNavigate();
  const overlayRef = useRef();

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  const handleStart = (type) => {
    if (!type.active) return;
    const token = localStorage.getItem("token");
    close();
    if (token) {
      navigate(type.route);
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && close()}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="animate-fade-up w-full relative"
        style={{
          maxWidth: 520,
          background: "#0c1120",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[var(--text-2)] hover:bg-white/10 transition-all flex items-center justify-center text-base cursor-pointer"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-7">
          <p className="text-[11px] font-semibold text-[var(--blue)] tracking-widest mb-2">SELECT FORMAT</p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--serif)" }}>
            Choose your interview
          </h2>
          <p className="text-sm text-[var(--text-2)] mt-1.5">Each format simulates a real FAANG interview experience.</p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-7">
          {TYPES.map((type, i) => (
            <button
              key={type.id}
              disabled={!type.active}
              onClick={() => handleStart(type)}
              className="animate-fade-up flex items-center gap-4 p-4 rounded-2xl text-left w-full transition-all"
              style={{
                animationDelay: `${i * 80}ms`,
                border: `1px solid ${type.active ? `${type.color}30` : "rgba(255,255,255,0.05)"}`,
                background: type.active ? `linear-gradient(135deg, ${type.glow}, transparent)` : "rgba(255,255,255,0.02)",
                cursor: type.active ? "pointer" : "not-allowed",
                opacity: type.active ? 1 : 0.45,
              }}
              onMouseEnter={(e) => {
                if (!type.active) return;
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow = `0 0 24px ${type.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${type.color}20, ${type.color}10)`,
                  border: `1px solid ${type.color}30`,
                  color: type.color,
                }}
              >
                {type.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-[var(--text)]">{type.label}</span>
                  {!type.active && <span className="badge badge-new text-[10px] px-2 py-0.5">Soon</span>}
                </div>
                <p className="text-xs text-[var(--text-2)] mb-2">{type.desc}</p>
                <div className="flex gap-1.5">
                  {type.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text-3)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {type.active && (
                <span className="text-lg opacity-70" style={{ color: type.color }}>→</span>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-[var(--text-3)] text-center">
          Login required · Free to use · AI-powered
        </p>
      </div>
    </div>
  );
}
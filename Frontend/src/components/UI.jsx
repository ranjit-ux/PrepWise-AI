/* ─── Reusable UI primitives ─── */

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  ...props
}) {
  const base = "btn";
  const variants = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    success: "btn-success",
    "outline-blue": "btn-outline-blue",
    danger: "btn-danger",
  };
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-6 py-3",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-[var(--bg-1)] border border-white/[0.07] rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = "topic", className = "" }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>{children}</span>
  );
}

export function Loader({ size = 16, color = "var(--blue)" }) {
  return (
    <span
      className="animate-spin inline-block rounded-full border-2"
      style={{
        width: size,
        height: size,
        borderColor: `${color}33`,
        borderTopColor: color,
      }}
    />
  );
}

export function ProgressBar({ value, max = 100, color = "var(--blue)", className = "" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`h-1.5 rounded-full bg-white/[0.06] overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
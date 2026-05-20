import { useState } from "react";
import { Loader } from "./ui";

/* ─── Result Badge ─── */
function ResultBadge({ status, message }) {
  const isAccepted = status === "Accepted";
  const isCompleted = 
    status === "Completed" || status === "Interview Completed";
  const isExecuted = status === "Executed";
  const isNext = status === "Next Question";
  const isWrong = status === "Wrong Answer";

  const isSuccess = isAccepted || isCompleted || isNext;

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs animate-fade-in"
      style={{
        background: isSuccess
            ? "rgba(52,211,153,0.08)"
            : isExecuted
            ? "rgba(59,130,246,0.08)"
            : "rgba(248,113,113,0.08)",
        border: `1px solid ${
          isSuccess
            ? "rgba(52,211,153,0.25)"
            : isExecuted
            ? "rgba(59,130,246,0.25)"
            : isWrong
            ? "rgba(251,191,36,0.25)"
            : "rgba(248,113,113,0.25)"
        }`,
        color: isSuccess
            ? "var(--emerald)"
            : isExecuted
            ? "var(--blue)"
            : isWrong
            ? "#FBBF24"
            : "#F87171",
      }}
    >
      <span className="font-semibold">
        {isSuccess ? "✓" : "✗"}
      </span>
      <span>{status}</span>
      {message && (
        <span className="text-[var(--text-3)]">— {message}</span>
      )}
    </div>
  );
}

/* ─── CONTROL BAR ─── */
export default function ControlBar({
  onRun,
  onSubmit,
  onFinish,
  runLoading = false,
  submitLoading=false,
  result = null,
}) {

  return (

    <div className="shrink-0">
      <div
        className="h-14 flex items-center px-5 gap-2.5 border-t"
        style={{
          background: "var(--bg-2)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Run */}
        <button
          onClick={onRun}
          disabled={runLoading}
          className="btn btn-outline-blue text-[13px] px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {runLoading && <Loader size={12} color="white" />}
          {runLoading ? "Running..." : "▶ Run"}
        </button>

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={submitLoading}
          className="btn btn-success text-[13px] px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
        >
          {submitLoading && <Loader size={12} color="white" />}
          {submitLoading ? "Submitting…" : "⬆ Submit"}
        </button>

        {/* Result */}
        {result && <ResultBadge {...result} />}

        <div className="flex-1" />

        {/* End session */}
        <button
          onClick={onFinish}
          className="btn btn-ghost text-xs px-3 py-1.5 rounded-lg text-[var(--text-3)]"
        >
          End Session
        </button>
      </div>
    </div>
  );
}
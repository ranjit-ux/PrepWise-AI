import { useState } from "react";

function TestCase({ tc, index }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] mb-2">
      <div className="px-3 py-1 text-[10px] text-[var(--text-3)] font-semibold tracking-widest border-b border-white/[0.05] bg-white/[0.025]">
        CASE {index + 1}
      </div>
      <div className="p-3 font-mono text-[11px] leading-[1.9] space-y-0.5">
        <div>
          <span className="text-[var(--text-3)]">Input: </span>
          <span className="text-[var(--cyan)]">{tc.input}</span>
        </div>
        <div>
          <span className="text-[var(--text-3)]">Output: </span>
          <span className="text-[var(--emerald)]">{tc.output}</span>
        </div>
        {tc.explanation && (
          <div className="text-[10px] text-[var(--text-3)] italic">{tc.explanation}</div>
        )}
      </div>
    </div>
  );
}

export default function LiveQuestionPanel({ question, currentQ = 0, totalQ = 3 }) {
  const [activeTab, setActiveTab] = useState("problem");

  const tabs = [
    { id: "problem", label: "Problem" },
    { id: "cases", label: "Test Cases" },
    { id: "notes", label: "Notes" },
  ];

  const diffColor = {
    Easy: "badge-easy",
    Medium: "badge-medium",
    Hard: "badge-hard",
  };

  if (!question) {
    return (
      <div className="w-[340px] shrink-0 bg-[var(--bg-1)] border-r border-white/[0.06] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--text-3)]">
          <div className="w-6 h-6 border-2 border-[var(--blue)]/30 border-t-[var(--blue)] rounded-full animate-spin" />
          <span className="text-xs">Loading question…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[340px] shrink-0 flex flex-col bg-[var(--bg-1)] border-r border-white/[0.06] h-full overflow-hidden">
      {/* Question progress bar */}
      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
        {Array.from({ length: totalQ }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full transition-all duration-500"
            style={{
              background:
                i < currentQ
                  ? "var(--emerald)"
                  : i === currentQ
                  ? "var(--blue)"
                  : "rgba(255,255,255,0.07)",
            }}
          />
        ))}
        <span className="text-[11px] text-[var(--text-3)] font-mono ml-1">
          {currentQ + 1}/{totalQ}
        </span>
      </div>

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-semibold text-[var(--text)] mb-2.5 leading-tight">
          {question.title}
        </h2>
        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className={`badge ${diffColor[question.difficulty] || "badge-medium"}`}>
            {question.difficulty || "Medium"}
          </span>
          {question.topic && (
            <span className="badge badge-topic text-[10px]">{question.topic}</span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-white/[0.06]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-1.5 text-xs font-medium border-none bg-transparent transition-all cursor-pointer"
              style={{
                borderBottom: `2px solid ${activeTab === tab.id ? "var(--blue)" : "transparent"}`,
                color: activeTab === tab.id ? "var(--text)" : "var(--text-3)",
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {activeTab === "problem" && (
          <div className="animate-fade-in">
            <p className="text-[13px] text-[var(--text-2)] leading-[1.8] mb-4 whitespace-pre-wrap">
              {question.description}
            </p>
            {question.constraints?.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-[var(--text-3)] tracking-widest mb-2">
                  CONSTRAINTS
                </p>
                {question.constraints.map((c, i) => (
                  <div key={i} className="flex gap-2 mb-1.5 items-start">
                    <span className="text-[var(--blue)] text-xs mt-0.5">·</span>
                    <span className="font-mono text-[11px] text-[var(--text-3)] leading-relaxed">{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "cases" && (
          <div className="animate-fade-in pt-1">
            <p className="text-[10px] font-semibold text-[var(--text-3)] tracking-widest mb-2">
              SAMPLE TEST CASES
            </p>
            {question.sampleTestCases?.map((tc, i) => (
              <TestCase key={i} tc={tc} index={i} />
            ))}
            {question.hiddenCount && (
              <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-violet-500/[0.06] border border-violet-500/20 text-[11px] text-[var(--text-3)]">
                <span className="text-[var(--violet)]">⊕ {question.hiddenCount} hidden</span> test cases run on Submit
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="animate-fade-in pt-1">
            <textarea
              placeholder="Jot down your approach, edge cases, complexity analysis…"
              className="w-full min-h-[200px] bg-transparent border border-white/[0.07] rounded-xl p-3 text-[var(--text-2)] text-[13px] leading-[1.7] resize-y outline-none"
              style={{ fontFamily: "var(--sans)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";

const QUESTIONS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays · Hash Map",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "Only one valid answer exists",
    ],
    sampleTestCases: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] = 6" },
    ],
    hiddenCount: 12,
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window · Hash Set",
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    constraints: [
      "0 ≤ s.length ≤ 5 × 10⁴",
      "s consists of English letters, digits, symbols and spaces",
    ],
    sampleTestCases: [
      { input: 's = "abcabcbb"', output: "3", explanation: '"abc" has length 3' },
      { input: 's = "bbbbb"', output: "1", explanation: '"b" has length 1' },
    ],
    hiddenCount: 14,
  },
  {
    id: 3,
    title: "Binary Tree Level Order",
    difficulty: "Medium",
    topic: "Trees · BFS",
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values (left to right, level by level).`,
    constraints: [
      "0 ≤ number of nodes ≤ 2000",
      "-1000 ≤ Node.val ≤ 1000",
    ],
    sampleTestCases: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]", explanation: "Level by level" },
      { input: "root = [1]", output: "[[1]]", explanation: "Single node" },
    ],
    hiddenCount: 11,
  },
];

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

export default function QuestionPanel({ currentQ = 0, onQChange }) {
  const [activeTab, setActiveTab] = useState("problem");
  const question = QUESTIONS[currentQ];

  const tabs = ["problem", "cases", "notes"];
  const diffClass = { Easy: "badge-easy", Medium: "badge-medium", Hard: "badge-hard" };

  return (
    <div className="w-[340px] shrink-0 flex flex-col bg-[var(--bg-1)] border-r border-white/[0.06] h-full overflow-hidden">
      {/* Question selector */}
      <div className="p-3 border-b border-white/[0.06] flex gap-2">
        {QUESTIONS.map((q, i) => (
          <button
            key={q.id}
            onClick={() => onQChange?.(i)}
            className="flex-1 py-2 rounded-lg text-[11px] font-semibold flex flex-col items-center gap-0.5 transition-all cursor-pointer border"
            style={{
              border: `1px solid ${i === currentQ ? "rgba(79,142,247,0.4)" : "rgba(255,255,255,0.06)"}`,
              background: i === currentQ ? "rgba(79,142,247,0.1)" : "transparent",
              color: i === currentQ ? "var(--blue)" : "var(--text-3)",
            }}
          >
            <span>{i < currentQ ? "✓" : i + 1}</span>
            <span className="text-[9px] opacity-70">{q.difficulty}</span>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="px-4 pt-4 pb-0">
        <h2 className="text-[15px] font-semibold text-[var(--text)] mt-3 mb-7 leading-tight">
          {question.title}
        </h2>
        {/* <div className="flex gap-1.5 flex-wrap mb-3">
          <span className={`badge ${diffClass[question.difficulty]}`}>{question.difficulty}</span>
          <span className="badge badge-topic text-[10px]">{question.topic}</span>
        </div> */}

        <div className="flex gap-0.5 border-b border-white/[0.06]">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-3 py-1.5 text-xs font-medium border-none bg-transparent transition-all cursor-pointer capitalize"
              style={{
                borderBottom: `2px solid ${activeTab === t ? "var(--blue)" : "transparent"}`,
                color: activeTab === t ? "var(--text)" : "var(--text-3)",
                marginBottom: -1,
              }}
            >
              {t === "cases" ? "Test Cases" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-3">
        {activeTab === "problem" && (
          <div className="animate-fade-in">
            <p className="text-[13px] text-[var(--text-2)] leading-[1.8] mb-4 whitespace-pre-wrap">
              {question.description}
            </p>
            <p className="text-[10px] font-semibold text-[var(--text-3)] tracking-widest mb-2">CONSTRAINTS</p>
            {question.constraints.map((c, i) => (
              <div key={i} className="flex gap-2 mb-1.5 items-start">
                <span className="text-[var(--blue)] text-xs mt-0.5">·</span>
                <span className="font-mono text-[11px] text-[var(--text-3)] leading-relaxed">{c}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "cases" && (
          <div className="animate-fade-in">
            <p className="text-[10px] font-semibold text-[var(--text-3)] tracking-widest mb-2">SAMPLE TEST CASES</p>
            {question.sampleTestCases.map((tc, i) => <TestCase key={i} tc={tc} index={i} />)}
            <div className="mt-3 px-3.5 py-2.5 rounded-xl bg-violet-500/[0.06] border border-violet-500/20 text-[11px] text-[var(--text-3)]">
              <span className="text-[var(--violet)]">⊕ {question.hiddenCount} hidden</span> test cases run on Submit
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="animate-fade-in">
            <textarea
              placeholder="Jot down your approach, edge cases, complexity analysis…"
              className="w-full min-h-[200px] bg-transparent border border-white/[0.07] rounded-xl p-3 text-[var(--text-2)] text-[13px] leading-[1.7] resize-y outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { QUESTIONS };
import { useState, useRef, useEffect } from "react";

export default function CodeEditor({
  onCodeChange,
  initialCode = "",
}) {
  const [code, setCode] = useState(initialCode || "");
  const [fontSize, setFontSize] = useState(13);
  const textareaRef = useRef(null);

  // Sync if parent resets code
  useEffect(() => {
    setCode(initialCode || "");
  }, [initialCode]);


  const handleChange = (e) => {
    setCode(e.target.value);
    onCodeChange?.(e.target.value);
  };

  const handleTab = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();

    const { selectionStart: s, selectionEnd: end } = e.target;
    const next = code.slice(0, s) + "    " + code.slice(end);

    setCode(next);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart =
          textareaRef.current.selectionEnd = s + 4;
      }
    });
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="flex-1 flex flex-col bg-[#0D1117] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-4 py-2 border-b border-white/[0.06] bg-[#0A0E17] shrink-0">
        {/* Language tabs */}
        <div className="flex gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
          <span
            className="px-3 py-1 rounded-md text-[11px] font-medium"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#00599C",
              fontFamily: "var(--mono)",
            }}
          >
            cpp
          </span>
        </div>

        {/* File name */}
        <span className="font-mono text-[11px] text-[var(--text-3)] opacity-60">
          solution.cpp
        </span>

        <div className="flex-1" />

        {/* Font size */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFontSize((f) => Math.max(10, f - 1))}
            className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.07] text-[var(--text-3)] cursor-pointer text-sm flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            −
          </button>
          <span className="font-mono text-[11px] text-[var(--text-3)] w-5 text-center">
            {fontSize}
          </span>
          <button
            onClick={() => setFontSize((f) => Math.min(20, f + 1))}
            className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.07] text-[var(--text-3)] cursor-pointer text-sm flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            +
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            const empty = "";
            setCode(empty); // 🔥 clears everything
            onCodeChange?.(empty);
          }}
          className="px-2.5 py-1 rounded-md text-[11px] bg-white/[0.03] border border-white/[0.07] text-[var(--text-3)] cursor-pointer hover:bg-white/[0.07] transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line numbers */}
        <div
          className="shrink-0 pt-4 pb-4 bg-[#0A0E17] border-r border-white/[0.04] font-mono text-right pr-2.5 overflow-hidden select-none"
          style={{
            width: 44,
            fontSize: fontSize - 1,
            lineHeight: 1.7,
            color: "var(--text-3)",
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{ opacity: 0.4 }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleTab}
          spellCheck={false}
          placeholder="// Start coding here..."
          className="flex-1 bg-[#0D1117] border-none outline-none resize-none placeholder:text-white/20"
          style={{
            color: "#E2E8F0",
            fontFamily: "var(--mono)",
            fontSize,
            lineHeight: 1.7,
            padding: "16px 20px",
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionPanel from "../components/QuestionPanel";
import CodeEditor from "../components/CodeEditor";
import ControlBar from "../components/ControlBar";
import logo from "../assets/favicon.svg";

function DemoTopBar({ qIndex }) {
  return (
    <div
      className="h-12 border-b flex items-center px-5 gap-4 shrink-0"
      style={{ background: "var(--bg-2)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-6 h-6" />
        <span className="text-[13px] font-semibold">
          PrepWise <span className="text-[var(--blue)]">AI</span>
        </span>
      </div>

      <div className="w-px h-5 bg-white/[0.07]" />

      <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Demo Mode · No submission
      </div>

      <div className="flex-1" />

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs border"
            style={{
              background: i === qIndex ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.03)",
              borderColor: i === qIndex ? "rgba(79,142,247,0.5)" : "rgba(255,255,255,0.08)",
              color: i === qIndex ? "var(--blue)" : "var(--text-3)",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DemoInterview() {
  const [currentQ, setCurrentQ] = useState(0);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <DemoTopBar qIndex={currentQ} />

      <div className="flex flex-1 overflow-hidden">
        <QuestionPanel currentQ={currentQ} onQChange={setCurrentQ} />
        <CodeEditor onCodeChange={setCode} />
      </div>

      <ControlBar
        onRun={() => {}}
        onSubmit={() => alert("Demo mode! sign in to submit code and get AI feedback.")}
        onHint={() => {}}
        onFinish={() => navigate("/")}
      />
    </div>
  );
}
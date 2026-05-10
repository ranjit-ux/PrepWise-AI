import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LiveQuestionPanel from "../components/LiveQuestionPanel";
import CodeEditor from "../components/CodeEditor";
import ControlBar from "../components/ControlBar";
import API, { startInterview, getCurrentQuestion, submitCode } from "../services/api";
import logo from "../assets/favicon.svg";

const TOTAL_QUESTIONS = 3;
const INTERVIEW_DURATION = 45 * 60; // 45 min in seconds

/* ─── Top Bar ─── */
function InterviewTopBar({ qIndex, timeLeft }) {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const pct = (timeLeft / INTERVIEW_DURATION) * 100;
  const isWarning = timeLeft < 600;
  const isDanger = timeLeft < 300;

  const timerColor = isDanger ? "#F87171" : isWarning ? "#FBBF24" : "var(--emerald)";

  return (
    <div className="h-12 border-b flex items-center px-5 gap-4 shrink-0 z-10"
      style={{ background: "var(--bg-2)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-5" />
        <span className="text-[13px] font-semibold text-[var(--text)]">
          PrepWise <span className="text-[var(--blue)]">AI</span>
        </span>
      </div>

      <div className="w-px h-5 bg-white/[0.07]" />

      <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        DSA Round · Live Session
      </div>

      <div className="flex-1" />

      {/* Timer */}
      <div className="flex items-center gap-2.5">
        <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: timerColor }}
          />
        </div>
        <span
          className="font-mono text-sm font-medium tracking-wider transition-colors duration-500 tabular-nums"
          style={{ color: timerColor, minWidth: 48 }}
        >
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </span>
      </div>

      {/* Question dots */}
      <div className="flex gap-1.5">
        {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs border transition-all"
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

/* ─── Completion overlay ─── */
function CompletionOverlay({ onDashboard }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
    >
      <div className="animate-fade-up text-center px-8 py-12 rounded-3xl border max-w-sm w-full"
        style={{ background: "var(--bg-1)", borderColor: "rgba(52,211,153,0.3)" }}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-semibold text-[var(--text)] mb-2" style={{ fontFamily: "var(--serif)" }}>
          Interview Complete!
        </h2>
        <p className="text-[var(--text-2)] text-sm mb-8 leading-relaxed">
          Great job finishing all questions. Your AI report is being generated.
        </p>
        <button
          onClick={onDashboard}
          className="btn btn-success w-full py-3 text-sm rounded-xl"
        >
          View My Report →
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function LiveInterview() {
  const [currentQ, setCurrentQ] = useState(0);
  const [interviewId, setInterviewId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(INTERVIEW_DURATION);
  const [completed, setCompleted] = useState(false);
  const [runLoading,setRunLoading] = useState(false);
  const [submitLoading,setSubmitLoading] = useState(false);
  const language_id = 54;

  const navigate = useNavigate();

  /* ─── Timer ─── */
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ─── Init interview ─── */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await startInterview();
        setInterviewId(res.data.interviewId);
        setQuestion(res.data.question);
      } catch (err) {
        console.error("Failed to start interview:", err);
      }
    };
    init();
  }, []);

  /* ─── Submit code ─── */
  const handleSubmit = async () => {
    if (!interviewId || submitLoading) return;
    setSubmitLoading(true);
    setResult(null);

    try {
      const res = await submitCode(interviewId, {
        source_code: code,
        language_id: 54,
      });

      setResult(res.data);

      if (res.data.status === "Accepted" || res.data.status === "Next Question") {
        const nextQ = await getCurrentQuestion(interviewId);
        setQuestion(nextQ.data);
        setCode("");
        setCurrentQ((prev) => Math.min(prev + 1, TOTAL_QUESTIONS - 1));
      }

      if (res.data.status === "Completed") {
        setCompleted(true);
        setResult({
          status:"Completed",
          message: "Generating AI report...",
        });

        localStorage.setItem("lastReport", JSON.stringify(res.data.report));

        return;
      }
    } catch (err) {
      console.error("Submit error:", err);
      setResult({ status: "Error", message: "Submission failed. Check your connection." });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRun = async () => {
    if(!code) return;

    setRunLoading(true);
    setResult(null);

    try{
      const res = await API.post("/code/run", {
        source_code: code,
        language_id: language_id,
        input: question?.sampleTestCases?.[0]?.input || "",
      });

      setResult({
        status: "Executed",
        message: res.data.output || res.data.error || "No output",
      });

    }catch(err){
      setResult({
        status: "Error",
        message: err.response?.data?.message || "Run failed",
      });
    }
    finally{
      setRunLoading(false);
    }
  }

  useEffect(() => {
    if(completed){
      setTimeout(() => {
        navigate("/dashboard");
      },2000);
    }
  },[completed]);

  /* ─── Finish session ─── */
  const handleFinish = () => {
    window.speechSynthesis?.cancel();
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <InterviewTopBar qIndex={currentQ} timeLeft={timeLeft} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[340px] border-r border-white/10">
        <LiveQuestionPanel question={question} currentQ={currentQ} totalQ={TOTAL_QUESTIONS} />
        </div>

        <CodeEditor
          onCodeChange={setCode}
          initialCode={code}
        />
      </div>

      <ControlBar
        onRun={handleRun}
        onSubmit={handleSubmit}
        onFinish={handleFinish}
        runLoading={runLoading}
        submitLoading={submitLoading}
        result={result}
      />

      {completed && <CompletionOverlay onDashboard={handleFinish} />}
    </div>
  );
}
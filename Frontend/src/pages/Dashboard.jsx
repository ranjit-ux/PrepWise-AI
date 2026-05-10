import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { ProgressBar, Loader } from "../components/ui";
import logo from "../assets/favicon.svg";

/* ─── Score ring ─── */
function ScoreRing({ score }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "var(--emerald)" : score >= 50 ? "var(--amber)" : "#F87171";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color }}>{score}</span>
        <span className="text-[10px] text-[var(--text-3)] font-medium tracking-wide">SCORE</span>
      </div>
    </div>
  );
}

/* ─── Metric card ─── */
function MetricCard({ label, value, max = 100, color }) {
  return (
    <div className="bg-[var(--bg)] border border-white/[0.07] rounded-xl p-4">
      <p className="text-[11px] text-[var(--text-3)] mb-2 font-medium">{label}</p>
      <p className="text-2xl font-bold mb-2.5" style={{ color }}>
        {value}<span className="text-sm text-[var(--text-3)] font-normal">/{max}</span>
      </p>
      <ProgressBar value={value} max={max} color={color} />
    </div>
  );
}


export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    const stored = localStorage.getItem("lastReport");

    if(stored){
      setReport(JSON.parse(stored));
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try{
        const interviewId = localStorage.getItem("lastInterviewId");
        if(interviewId){
          const res = await API.get(`/interview/report/${interviewId}`);
          setReport(res.data);
        }
      }catch(err){
        console.error("Report fetch error: ",err);
      }finally{
        setLoading(false);
      }
    };
    fetchReport();
  },[]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastInterviewId");
    navigate("/");
  };

  const scoreColor =
    report?.score >= 75 ? "var(--emerald)" : report?.score >= 50 ? "var(--amber)" : "#F87171";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Top nav */}
      <header
        className="border-b px-25 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{ background: "rgba(6,9,16,0.9)", borderColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
      >
        <Link to="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition">
          <img src={logo} className="w-6 h-6" />
          <span className="font-semibold text-sm">
            PrepWise <span className="text-[var(--blue)]">AI</span>
          </span>
        </Link>
        <button onClick={handleLogout} className="text-xs text-[var(--text-3)] hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10 cursor-pointer">
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-1.5" style={{ fontFamily: "var(--serif)", letterSpacing: "-0.02em" }}>
            Your Interview Report
          </h1>
          <p className="text-[var(--text-2)] text-sm">AI-powered analysis of your performance</p>
        </div>

        {/* Start new interview */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/interview-live")}
            className="btn btn-primary text-sm px-5 py-2.5 rounded-xl hover:scale-[1.05] "
          >
            Start New Interview
          </button>
          
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-[var(--text-3)]">
              <Loader size={24} />
              <span className="text-sm">Loading your report…</span>
            </div>
          </div>
        ) : report ? (
          <div className="space-y-6">
            {/* Score overview */}
            <div
              className="rounded-2xl p-6 border flex flex-col sm:flex-row items-start sm:items-center gap-6"
              style={{ background: "var(--bg-1)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <ScoreRing score={report.score} />

              <div className="flex-1">
                <p className="text-xs text-[var(--text-3)] font-semibold tracking-widest mb-1">OVERALL SCORE</p>
                <h2 className="text-4xl font-bold mb-1 tabular-nums" style={{ color: scoreColor }}>
                  {report.score}%
                </h2>
                <p className="text-sm text-[var(--text-2)]">
                  {report.score >= 75
                    ? "Excellent performance you're interview-ready."
                    : report.score >= 50
                    ? "Good foundation a few more sessions will sharpen your edge."
                    : "Keep practicing consistency is key."}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Code Quality"
                value={report.codeQuality}
                color="var(--blue)"
              />
              <MetricCard
                label="Problem Solving"
                value={report.problemSolving}
                color="var(--violet)"
              />
              <MetricCard
                label="Communication"
                value={report.communication}
                color="var(--cyan)"
              />
            </div>

            {/* Strengths + Weaknesses */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div
                className="rounded-2xl p-5 border"
                style={{ background: "var(--bg-1)", borderColor: "rgba(52,211,153,0.15)" }}
              >
                <p className="text-xs font-semibold text-[var(--emerald)] tracking-widest mb-3">STRENGTHS</p>
                <ul className="space-y-2">
                  {(report.strengths || []).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                      <span className="text-[var(--emerald)] mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl p-5 border"
                style={{ background: "var(--bg-1)", borderColor: "rgba(248,113,113,0.15)" }}
              >
                <p className="text-xs font-semibold text-[#F87171] tracking-widest mb-3">AREAS TO IMPROVE</p>
                <ul className="space-y-2">
                  {(report.weaknesses || []).map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-2)]">
                      <span className="text-[#F87171] mt-0.5">→</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Feedback */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: "linear-gradient(135deg, rgba(79,142,247,0.05), rgba(155,110,250,0.04))",
                borderColor: "rgba(79,142,247,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <img src={logo} alt="Logo" className="w-6 h-6" />
                <p className="text-xs font-semibold text-[var(--blue)] tracking-widest">FEEDBACK</p>
              </div>
              <p className="text-sm text-[var(--text-2)] leading-[1.8]">{report.feedback}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--text-3)]">
            <p className="text-sm">No report found. Complete an interview to see your results.</p>
          </div>
        )}
      </main>
    </div>
  );
}
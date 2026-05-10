import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import StartModal from "../components/StartModal";
import Navbar from "../components/Navbar";
import logo from "../assets/favicon.svg";

/* ─── Ambient orbs ─── */
function Orbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[5%] -right-[15%] w-[600px] h-[600px] rounded-full opacity-70 blur-2xl animate-pulse"
        style={{ background: "radial-gradient(circle,rgba(155,110,250,0.08) 0%,transparent 70%)" }} />
      <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full opacity-70 blur-2xl animate-pulse"
        style={{ background: "radial-gradient(circle,rgba(34,211,238,0.04) 0%,transparent 70%)" }} />
      <div className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%,black 40%,transparent 100%)",
        }} />
    </div>
  );
}

/* ─── Feature card ─── */
function FeatureCard({ icon, title, desc, color, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="animate-fade-up rounded-[18px] p-6 transition-all duration-300 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animationDelay: `${delay}ms`,
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.055)"}`,
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.3),inset 0 0 0 1px rgba(255,255,255,0.04)" : "none",
      }}
    >
      <div className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-xl"
        style={{ background: `linear-gradient(135deg, ${color}22, ${color}11)`, border: `1px solid ${color}30` }}>
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold mb-2 text-[var(--text)] tracking-tight">{title}</h3>
      <p className="text-[13px] text-[var(--text-2)] leading-[1.7]">{desc}</p>
    </div>
  );
}

/* ─── Stat counter ─── */
function StatCard({ value, label, suffix = "", color, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => {
          start += Math.ceil(value / 40);
          if (start >= value) { setDisplayed(value); return; }
          setDisplayed(start);
          requestAnimationFrame(step);
        };
        setTimeout(() => requestAnimationFrame(step), delay);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className="animate-fade-up text-center" style={{ animationDelay: `${delay}ms` }}>
      <div
        className="text-[40px] font-bold tracking-tight"
        style={{
          fontFamily: "var(--serif)",
          background: `linear-gradient(135deg, ${color}, #fff)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {displayed.toLocaleString()}{suffix}
      </div>
      <div className="text-[13px] text-[var(--text-3)] mt-1">{label}</div>
    </div>
  );
}

/* ─── Live preview mockup ─── */
function InterviewPreview() {
  const lines = [
    { type: "ai",   text: "Explain your approach to the Two Sum problem.", delay: 0 },
    { type: "code", text: "const map = {};\nfor (let i = 0; i < nums.length; i++) {\n  const c = target - nums[i];\n  if (map[c] !== undefined) return [map[c], i];\n  map[nums[i]] = i;\n}", delay: 300 },
    { type: "ai",   text: "Great. What's the time complexity?", delay: 600 },
    { type: "user", text: "O(n) time and O(n) space using a hash map.", delay: 900 },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timers = lines.map((l, i) =>
      setTimeout(() => setVisible(i + 1), 1000 + l.delay + i * 500)
    );
    const restart = setInterval(() => {
      setVisible(0);
      lines.forEach((l, i) => setTimeout(() => setVisible(i + 1), 500 + l.delay + i * 500));
    }, 9000);
    return () => { timers.forEach(clearTimeout); clearInterval(restart); };
  }, []);

  return (
    <div className="w-full rounded-[18px] overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
        {["#EF4444","#FBBF24","#34D399"].map(c => (
          <div key={c} className="w-2.5 h-2.5 rounded-full opacity-70" style={{ background: c }} />
        ))}
        <span className="ml-2 font-mono text-[11px] text-[var(--text-3)]">prepwise — DSA Round · Q1 / 3</span>
        <div className="ml-auto flex gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] text-[var(--emerald)]"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>● LIVE</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] text-[var(--text-3)]"
            style={{ background: "rgba(255,255,255,0.05)" }}>38:22</span>
        </div>
      </div>

      <div className="flex min-h-[260px]">
        {/* Chat panel */}
        <div className="flex flex-col gap-2.5 p-4 border-r" style={{ width: "42%", borderColor: "rgba(255,255,255,0.05)" }}>
          {lines.map((line, i) => (
            <div key={i}
              className="transition-all duration-500"
              style={{ opacity: i < visible ? 1 : 0, transform: i < visible ? "none" : "translateY(6px)" }}
            >
              {line.type === "ai" && (
                <div className="rounded-xl p-2.5 text-[11px] text-[var(--text-2)] leading-[1.6]"
                  style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.15)" }}>
                  <span className="block mb-1 text-[10px] font-bold text-[var(--blue)]">AI INTERVIEWER</span>
                  {line.text}
                </div>
              )}
              {line.type === "user" && (
                <div className="rounded-xl p-2.5 text-[11px] text-[var(--text-2)] leading-[1.6] ml-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="block mb-1 text-[10px] font-bold text-[var(--cyan)]">YOU</span>
                  {line.text}
                </div>
              )}
              {line.type === "code" && (
                <div className="rounded-lg p-2.5 text-[10px] leading-[1.8] whitespace-pre"
                  style={{ background: "#0D1117", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--mono)", color: "#94A3B8" }}>
                  {line.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Code mockup */}
        <div className="flex-1 p-4 font-mono text-[11px] leading-[1.9]" style={{ background: "#0D1117", color: "#4B5675" }}>
          <div style={{ color: "#3B82F6" }}>{"/** @param {number[]} nums */"}</div>
          <div><span style={{ color: "#C792EA" }}>function</span> <span style={{ color: "#82AAFF" }}>twoSum</span>(<span style={{ color: "#FFCB6B" }}>nums, target</span>) {"{"}</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: "#C792EA" }}>const</span> map = {"{}"};</div>
          <div style={{ paddingLeft: 16 }}><span style={{ color: "#C792EA" }}>for</span> (<span style={{ color: "#C792EA" }}>let</span> i = 0; i {"<"} nums.length; i++) {"{"}</div>
          <div style={{ paddingLeft: 32 }}><span style={{ color: "#C792EA" }}>if</span> (map[target - nums[i]] !== undefined) <span style={{ color: "#C792EA" }}>return</span> [map[target-nums[i]], i];</div>
          <div style={{ paddingLeft: 32 }}>map[nums[i]] = i;</div>
          <div style={{ paddingLeft: 16 }}>{"}"}</div>
          <div>{"}"}</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex gap-2 items-center px-4 py-2.5 border-t" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}>
        {[{ label: "▶ Run", color: "#4F8EF7", bg: "rgba(79,142,247,0.1)" },
          { label: "⬆ Submit", color: "#34D399", bg: "rgba(52,211,153,0.1)" },
          { label: "💡 Hint", color: "#FBBF24", bg: "rgba(251,191,36,0.1)" }].map(b => (
          <div key={b.label} className="px-3 py-1 rounded-lg text-[11px] font-medium cursor-pointer"
            style={{ background: b.bg, color: b.color }}>{b.label}</div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>🎤</div>
          <div className="w-14 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="w-[70%] h-full rounded-full" style={{ background: "var(--blue)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Company logos ─── */
function TrustStrip() {
  const companies = ["Google", "Meta", "Amazon", "Apple", "Netflix", "Microsoft"];
  return (
    <div className="text-center animate-fade-up delay-800">
      <p className="text-[11px] text-[var(--text-3)] tracking-[0.1em] font-medium mb-5">CANDIDATES LAND ROLES AT</p>
      <div className="flex gap-3 justify-center flex-wrap">
        {companies.map(c => (
          <div key={c} className="text-[13px] font-medium text-[var(--text-3)] px-4 py-1.5 rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HOME PAGE ─── */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Orbs />

      <div className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-[120px] pb-20 text-center">
          {/* Pill */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-9"
            style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)" }}>
            <div className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wide"
              style={{ background: "linear-gradient(135deg, var(--blue), var(--violet))" }}>NEW</div>
            <span className="text-xs text-[var(--blue)] font-medium">Groq AI powered evaluation</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 font-normal leading-[1.08] tracking-tight max-w-[820px] mb-7"
            style={{ fontSize: "clamp(44px,7vw,80px)", fontFamily: "var(--serif)", letterSpacing: "-0.03em" }}>
            <span className="gradient-text">Ace your next</span>
            <br />
            <span className="text-[var(--text)] italic">FAANG interview.</span>
          </h1>

          {/* Sub */}
          <p className="animate-fade-up delay-200 text-[18px] text-[var(--text-2)] leading-[1.7] max-w-[520px] mb-11 font-light">
            Voice-driven AI interviews with real code execution, FAANG-caliber feedback, and a 45-minute simulation that mirrors the real thing.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex gap-3 flex-wrap justify-center">
            <button
              className="btn btn-primary text-[15px] px-7 py-3.5 rounded-xl"
              onClick={() => setModalOpen(true)}
            >
              Start Interview Free
            </button>
            <a href="#how" className="btn btn-ghost text-[15px] px-6 py-3.5 rounded-xl no-underline">
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div className="animate-fade-up delay-400 flex items-center gap-3 mt-8">
            <div className="flex">
              {["#4F8EF7","#9B6EFA","#22D3EE","#34D399"].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2"
                  style={{ background: `linear-gradient(135deg, ${c}88, ${c}44)`, borderColor: "var(--bg)", marginLeft: i > 0 ? -8 : 0 }} />
              ))}
            </div>
            <span className="text-[13px] text-[var(--text-2)]">
              <strong className="text-[var(--text)]">2,000+</strong> engineers practiced this week
            </span>
          </div>

          {/* Preview */}
          <div className="animate-fade-up delay-500 mt-16" style={{ width: "min(860px,100%)" }}>
            <InterviewPreview />
          </div>
        </section>

        {/* Trust strip */}
        <section className="px-6 pb-20">
          <div className="max-w-[900px] mx-auto">
            <TrustStrip />
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-6">
          <div className="max-w-[700px] mx-auto">
            <div className="grid grid-cols-3 gap-px rounded-[20px] overflow-hidden"
              style={{ background: "var(--border)", border: "1px solid var(--border)" }}>
              {[
                { value: 2000, label: "practice sessions", suffix: "+", color: "var(--blue)", delay: 0 },
                { value: 94, label: "pass rate improvement", suffix: "%", color: "var(--violet)", delay: 100 },
                { value: 45, label: "minute simulation", suffix: "min", color: "var(--cyan)", delay: 200 },
              ].map((s, i) => (
                <div key={i} className="py-10 px-6" style={{ background: "var(--bg-1)" }}>
                  <StatCard {...s} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="how" className="py-20 px-6">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-14">
              <p className="animate-fade-up text-[11px] text-[var(--blue)] tracking-[0.12em] font-semibold mb-3">HOW IT WORKS</p>
              <h2 className="animate-fade-up delay-100 font-normal tracking-tight text-[var(--text)]"
                style={{ fontSize: "clamp(28px,4vw,40px)", fontFamily: "var(--serif)", letterSpacing: "-0.025em" }}>
                Built to feel like the real thing
              </h2>
              <p className="animate-fade-up delay-200 text-[15px] text-[var(--text-2)] mt-3 max-w-[420px] mx-auto">
                Every detail engineered to replicate the pressure and format of a real interview.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: "🎤", title: "Voice-first interaction", desc: "Speak your thoughts naturally. The AI listens, interrupts, and follows up just like a real interviewer.", color: "var(--blue)", delay: 0 },
                { icon: "💻", title: "Monaco code editor", desc: "Write code in a real editor with syntax highlighting. Run against test cases and get instant feedback.", color: "var(--violet)", delay: 100 },
                { icon: "🧩", title: "AI-powered evaluation", desc: "Gemini analyzes your code quality, time complexity, and how clearly you communicate your approach.", color: "var(--cyan)", delay: 200 },
                { icon: "⏱️", title: "Strict time limits", desc: "45-minute total session with automated follow-ups when you spend too long on one problem.", color: "var(--emerald)", delay: 300 },
                { icon: "💡", title: "Spoken hints only", desc: "Hints are spoken aloud never shown as text forcing you to internalize, just like a real interviewer.", color: "var(--amber)", delay: 400 },
                { icon: "🎯", title: "Final performance report", desc: "Receive a detailed breakdown: technical score, communication grade, strengths, and growth areas.", color: "var(--rose)", delay: 500 },
              ].map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-20 px-6">
          <div className="max-w-[720px] mx-auto">
            <div className="animate-fade-up relative rounded-[28px] overflow-hidden text-center px-14 py-16"
              style={{
                background: "linear-gradient(145deg,#0d1117 0%,#0f1623 50%,#111827 100%)",
                border: "1px solid rgba(79,142,247,0.25)",
              }}
            >
              {/* Glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse,rgba(79,142,247,0.18) 0%,transparent 70%)" }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(79,142,247,0.8),rgba(155,110,250,0.6),transparent)" }} />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full mb-7"
                  style={{ border: "1px solid rgba(79,142,247,0.35)", background: "rgba(79,142,247,0.1)" }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--blue)", boxShadow: "0 0 6px rgba(79,142,247,0.8)" }} />
                  <span className="text-[11px] text-[var(--blue)] tracking-[0.1em] font-semibold">START TODAY</span>
                </div>

                <h2 className="font-normal tracking-tight leading-[1.2] mb-4.5 text-[#f0f4ff]"
                  style={{ fontSize: "clamp(28px,4vw,42px)", fontFamily: "var(--serif)", letterSpacing: "-0.02em" }}>
                  Your next offer<br />
                  <span style={{ background: "linear-gradient(90deg,#4f8ef7,#9b6efa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    starts here.
                  </span>
                </h2>

                <p className="text-[15px] mb-10 leading-[1.75] max-w-[420px] mx-auto"
                  style={{ color: "rgba(180,196,230,0.75)" }}>
                  No credit card. Just open a session and start practicing right now.
                </p>

                <button
                  className="btn px-9 py-3.5 text-[15px] rounded-xl font-semibold text-white"
                  onClick={() => setModalOpen(true)}
                  style={{
                    background: "linear-gradient(135deg,#4f8ef7 0%,#7b6efa 100%)",
                    boxShadow: "0 0 28px rgba(79,142,247,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  Begin Interview →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t px-6 py-16 relative overflow-hidden"
          style={{ background: "linear-gradient(180deg,#0d1117 0%,#080b10 100%)", borderColor: "rgba(79,142,247,0.15)" }}
        >
          <div className="max-w-[1100px] mx-auto">
            <div className="grid gap-10 mb-14" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              <div>
                <div className="flex items-center gap-2 mb-4">
                    <img 
                      src={logo} 
                      alt="logo" 
                      className="w-5 h-5 object-contain"
                    />
                  <span className="font-bold text-sm text-[var(--text)]">PrepWise <span className="text-[var(--blue)]">AI</span></span>
                </div>
                <p className="text-[13.5px] leading-[1.75] max-w-[260px] mb-6" style={{ color: "rgba(180,196,230,0.55)" }}>
                  AI-powered mock interviews that prep you for any offer from FAANG to early-stage startups.
                </p>
              </div>
              {[
                { heading: "Product", links: ["Mock Interviews", "DSA Questions", "Resume Review", "Salary Negotiation"] },
                { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
                { heading: "Support", links: ["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"] },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <p className="text-[11px] font-bold text-[var(--blue)] tracking-[0.1em] mb-4 uppercase">{heading}</p>
                  <ul className="list-none space-y-2.5">
                    {links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-[13.5px] no-underline transition-colors" style={{ color: "rgba(180,196,230,0.55)" }}
                          onMouseEnter={e => e.target.style.color = "#a5bef5"}
                          onMouseLeave={e => e.target.style.color = "rgba(180,196,230,0.55)"}
                        >{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center flex-wrap gap-3 pt-6 border-t" style={{ borderColor: "rgba(79,142,247,0.1)" }}>
              <p className="text-[12.5px] m-0" style={{ color: "rgba(180,196,230,0.35)" }}>
                © {new Date().getFullYear()} PrepWise AI. All rights reserved.
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.7)" }} />
                <span className="text-xs" style={{ color: "rgba(180,196,230,0.4)" }}>All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {modalOpen && <StartModal close={() => setModalOpen(false)} />}
    </div>
  );
}
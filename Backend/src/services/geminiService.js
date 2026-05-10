import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateReview = async ({ questions, submissions, speech }) => {
  try {
    const prompt = `
You are a strict DSA interviewer.

Evaluate candidate on:
- Code correctness
- Efficiency
- Attempts
- Communication

Questions:
${JSON.stringify(questions)}

Submissions:
${JSON.stringify(submissions).slice(0, 3000)}

Speech:
${speech}

Return ONLY JSON:

{
  "score": number,
  "codeQuality": number,
  "problemSolving": number,
  "communication": number,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "feedback": "..."
}
`;

    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        score: 0,
        codeQuality: 0,
        problemSolving: 0,
        communication: 0,
        strengths: [],
        weaknesses: [],
        feedback: raw,
      };
    }

    return parsed;

  } catch (err) {
    console.log("🔥 GROQ ERROR:", err.response?.data || err.message);

    return {
      score: 0,
      codeQuality: 0,
      problemSolving: 0,
      communication: 0,
      strengths: [],
      weaknesses: [],
      feedback: "AI evaluation failed",
    };
  }
};
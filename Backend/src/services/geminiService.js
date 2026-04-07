import axios from "axios";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

export const generateReview = async ({ question, code, status, failedTestCase }) => {
  try {
    const prompt = `
You are a senior software engineer interviewer.

Analyze the candidate's solution.

Question:
${question}

Candidate Code:
${code}

Result:
${status}

Failed Test Case:
${failedTestCase ? JSON.stringify(failedTestCase) : "None"}

Give structured feedback:

1. Correctness
2. Approach
3. Time & Space Complexity
4. Mistakes
5. Suggestions
6. Final Verdict (Strong / Average / Weak)

Keep it concise and professional.
`;

    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    return response.data.candidates[0].content.parts[0].text;

  } catch (err) {
    console.log("🔥 GEMINI ERROR:", err.response?.data || err.message);
    return "AI review not available.";
  }
};
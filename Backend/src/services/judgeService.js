import axios from "axios";

const JUDGE0_URL = "http://localhost:2358";

export const runCode = async (source_code, language_id, input) => {
    try {
        const fixedInput = typeof input === "string" ? input.split("\\n").join("\n") : input;

        console.log("FINAL INPUT SENT:\n",fixedInput);
        

        const response = await axios.post(
            `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
            {
                source_code,
                language_id,
                stdin: fixedInput,
            }
        );

        return response.data;

    } catch (err) {
        console.log("🔥 JUDGE ERROR:", err.response?.data || err.message);
        throw err;
    }
};
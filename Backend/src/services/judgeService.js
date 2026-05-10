import axios from "axios";

const JUDGE0_URL = "http://localhost:2358";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const runCode = async (source_code, language_id, input) => {
    try {
        const fixedInput = typeof input === "string" 
            ? input.split("\\n").join("\n") 
            : input;

        console.log("FINAL INPUT SENT:\n", fixedInput);

        // ✅ FIXED URL
        const submitResponse = await axios.post(
            `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
            {
                source_code,
                language_id,
                stdin: fixedInput,
            }
        );

        const token = submitResponse.data.token;

        if (!token) throw new Error("No token received from Judge0");

        let result;

        // ✅ Increased polling
        for (let i = 0; i < 20; i++) {
            await sleep(1000);

            const resultResponse = await axios.get(
                `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`
            );

            result = resultResponse.data;

            if (result.status?.id > 2) break;
        }

        // ✅ Handle all outputs
        let output = "";

        if (result.stdout !== null && result.stdout !== undefined) {
            output = result.stdout;
        } else if (result.stderr) {
            output = result.stderr;
        } else if (result.compile_output) {
            output = result.compile_output;
        }

        console.log("FINAL OUTPUT:", output);
        console.log("STATUS:", result.status?.description);
        console.log("FULL RESULT:", JSON.stringify(result, null, 2));

        return result;

    } catch (err) {
        console.log("🔥 JUDGE ERROR:", err.response?.data || err.message);
        throw err;
    }
};
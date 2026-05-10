import { runLocalCode } from "../services/localExecutor.js";

export const runCodeController = async (req, res) => {
  try {
    const { source_code, language_id, input } = req.body;

    let language;
    if(language_id==54) language="cpp";
    else if(language_id==63) language="javascript";
    else if(language_id==71) language="python";
    else language="cpp";

    const result = await runLocalCode(source_code, language, input);

    return res.json({
      output: result?.stdout || "",
      error: result?.stderr || result?.compile_output || "",
      status: result?.status || "Unknown",
    });

  } catch (err) {
    console.log("🔥 RUN ERROR:", err.message);

    return res.status(500).json({
      status: "Error",
      message: err.message || "Execution failed",
    });
  }
};
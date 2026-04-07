import { runCode } from "../services/judgeService.js";

export const runCodeController = async (req,res) => {
    try{
        const {source_code,language_id,input} = req.body;

        const result = await runCode(source_code,language_id,input);

        res.json({
            output: result.stdout,
            error: result.stderr,
            status: result.status.description,
        });

    }catch(err){
        res.status(500).json({message: err.message});
    }
};


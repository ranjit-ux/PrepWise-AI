import Interview from "../models/Interview.js";
import Question from "../models/Question.js";
import { generateReview } from "../services/geminiService.js";
import { runCode } from "../services/judgeService.js"; 

export const startInterview = async (req,res) => {
    try{

        const questions = await Question.aggregate([
            {$sample: {size: 3}},
        ]);

        if(questions.length < 3){
            return res.status(400).json({
                message: "Not enough questions in database",
            });
        }

        const questionIds = questions.map((q) => q._id);

        const interview = await Interview.create({
            user:req.user._id,
            questions:questionIds,
        });

        const firstQuestion = {
            _id:questions[0]._id,
            title:questions[0].title,
            description: questions[0].description,
            sampleTestCases:questions[0].sampleTestCases,
        };

        res.json({
            interviewId:interview._id,
            question:firstQuestion,
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

export const getCurrentQuestion = async(req,res) => {
    try{
        const {id} = req.params;
        const interview = await Interview.findById(id).populate("questions");

        if(!interview){
            return res.status(404).json({message: "Interview not found"});
        };

        const index = interview.currentQuestionIndex;
        const question = interview.questions[index];

        if(!question){
            return res.status(400).json({message: "No more questions"});
        }

        const safeQuestion = {
            _id: question._id,
            title:question.title,
            description:question.description,
            sampleTestCases:question.sampleTestCases,
        };

        res.json(safeQuestion);

    }catch(err){
        res.status(500).json({message:err.message});
    }
}

// submit code

export const submitCode = async (req,res) => {
    try{

        const { id } = req.params;
        const {source_code,language_id} = req.body;

        const interview = await Interview.findById(id).populate("questions");

        if(!interview){
            return res.status(404).json({message:"Interview not found"});
        }

        const index = interview.currentQuestionIndex;
        const question = interview.questions[index];

        if(!question){
            return res.status(400).json({message:"No question found"});
        }

        //Initialize attempts
        if(!interview.attempts || interview.attempts.length < 3){
            interview.attempts = [0,0,0];
        }

        if(interview.attempts[index] === undefined){
            interview.attempts[index]=0;
        }

        //select testcases
        const tests = question.hiddenTestCases && question.hiddenTestCases.length > 0 ? question.hiddenTestCases : question.sampleTestCases;

        let failedTestCase = null;

        //Normalize function
        const normalize = (str) => str?.trim().split(/\s+/).join(" ");

        for(let test of tests){
            const result = await runCode(source_code,language_id,test.input);

            const output = result.stdout?.trim();
            const error = result.stderr;
            const status = result.status?.description;
            const compileError = result.compile_output;

            console.log("INPUT: ",test.input);
            console.log("EXPECTED: ",test.output);
            console.log("OUTPUT: ", output);
            console.log("STATUS: ", status);
            console.log("ERROR: ",error);

            //compile error
            if(compileError){
                return res.json({
                    status:"Compilation Error",
                    message:"Your code failed to compile",
                    error: compileError,
                });
            }

            //runtime error
            if(error || status === "Runtime Error"){
                return res.json({
                    status:"Runtime Error",
                    message:"Your code encountered a runtime error",
                    error: error || status,
                });
            }

            //wrong answer -> stop immediately
            if(!output || normalize(output) !== normalize(test.output)){
                failedTestCase = {
                    input: test.input,
                    expected: test.output,
                    got:output || "No Output",
                };
                break;
            }
        }

        //handle failed test cases
        if(failedTestCase){
            interview.attempts[index]+=1;

            //allow retry
            if(interview.attempts[index]<2){
                await interview.save();

                return res.json({
                    status: "Wrong Answer",
                    message:"Your solution did not pass all test cases. Try again",
                    failedTestCase,
                    attempts: interview.attempts[index],
                });
            }

            //move to next question
            interview.currentQuestionIndex++;

            if(interview.currentQuestionIndex >= 3){
                interview.status  = "completed";

                const review = await generateReview({
                    question:question.description,
                    code:source_code,
                    status:"Accepted",
                    failedTestCase:null
                });

                interview.review = review;

                await interview.save();

                return res.json({
                    status: "Completed",
                    message:"Interview completed",
                });
            }

            await interview.save();

            return res.json({
                status:"Next Question",
                message:"Moving to next question",
                failedTestCase,
            });
        }

        //success -> all test cases passed
        interview.currentQuestionIndex++;
        if(interview.currentQuestionIndex >= 3){
            interview.status = "completed";
            await interview.save();

            return res.json({
                status:"Accepted",
                message:"All test cases passed. Interview completed",
            });
        }

        await interview.save();

        return res.json({
            status:"Accepted",
            message:"Correct solution. Moving to next question",
        });

    }catch(err){
        console.log("FULL ERROR: ",err);
        console.log("ERROR RESPONSE: ", err.response?.data);
        return res.status(500).json({message: err.message});
    }
};
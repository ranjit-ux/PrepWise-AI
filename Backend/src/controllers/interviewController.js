import Interview from "../models/Interview.js";
import Question from "../models/Question.js";
import { generateReview } from "../services/geminiService.js";
import { runLocalCode } from "../services/localExecutor.js";

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
            user:req.user,                             //user:req.user._id,
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
            return res.json({
                status:"Interview Completed",
                message: "All questions solved"
            });
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
        const normalize = (str) => str?.toString().trim().replace(/\r/g, "").replace(/\n/g," ").replace(/\s+/g," ");

        for(let test of tests){

            let language="cpp";

            const result = await runLocalCode(source_code,language,test.input);

            let output="";
            if(result.stdout !== undefined){
                output = result.stdout.trim();
            }

            const error = result.stderr;

            console.log("INPUT: ",test.input);
            console.log("EXPECTED: ",test.output);
            console.log("OUTPUT: ", output);
            console.log("STATUS: ", result.status);
            console.log("ERROR: ",error);

            //compilation error
            if(result.status === "Compilation Error"){
                return res.json({
                    status:"Compilation Error",
                    message: error
                });
            }

            //Runtime error
            if(result.status === "Runtime Error"){
                return res.json({
                    status: "Runtime Error",
                    message:error
                });
            }

            //wrong answer -> stop immediately
            if(normalize(output) !== normalize(test.output)){
                failedTestCase = {
                    input: test.input,
                    expected: test.output,
                    got:output==="" ? "No Output" : output,
                };
                break;
            }
        }

        //handle failed test cases
        if(failedTestCase){
            interview.attempts[index]+=1;
            
            interview.codeSubmission.push({
                questionId: question._id,
                code: source_code,
                result: "Wrong"
            });

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
                    questions:interview.questions,
                    submissions:interview.codeSubmission,
                    speech:interview.speechTranscript
                });

                interview.report=review;

                await interview.save();

                return res.json({
                    status: "Completed",
                    message:"Interview completed",
                    report: interview.report
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
        interview.codeSubmission.push({
            questionId: question._id,
            code: source_code,
            result: "Accepted"
        })

        interview.currentQuestionIndex++;
        if(interview.currentQuestionIndex >= 3){

            const review = await generateReview({
                questions: interview.questions,
                submissions: interview.codeSubmission,
                speech: interview.speechTranscript
            });

            let parsed;
            
            interview.report = review;

            interview.status = "completed";
            await interview.save();

            return res.json({
                status:"Completed",
                message:"Interview completed",
                interviewId: interview._id,
                report:interview.report,
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


export const saveSpeech = async (req,res) => {
    try{
        const {id} = req.params;
        const {text} = req.body;

        const interview = await Interview.findById(id);
        if(!interview){
            return res.status(404).json({message:"Interview not found"});
        }

        interview.speechTranscript = (interview.speechTranscript || "") + " " + text;

        await interview.save();

        res.json({
            message:"Speech saved"
        });
    }catch(err){
        res.status(500).json({message:err.message});
    };
}


export const getLatestReport = async(req,res) => {
    const interview = await Interview.findOne({
        user: req.user,
        status: "completed"
    }).sort({createdAt: -1});

    res.json(interview?.report || null);
};



export const getReport = async (req,res) => {
    try{
        const {id} = req.params;

        const interview = await Interview.findById(id);

        if(!interview){
            return res.status(404).json({message: "Interview not found"});
        }

        res.json(interview.report);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};
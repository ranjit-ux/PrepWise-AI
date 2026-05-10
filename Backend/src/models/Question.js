import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        hint:{
            type:String,
        },
        inputFormat: String,
        outputFormat: String,
        constraints: String,
        sampleTestCases: [
            {
                input: String,
                output: String,
                explanation: String,
            },
        ],
        hiddenTestCases: [
            {
                input:String,
                output:String,
            },
        ],
        starterCode:{
            javascript: String,
            python: String,
            cpp: String,
        },
    }
);

const Question = mongoose.model("Question",questionSchema);

export default Question;
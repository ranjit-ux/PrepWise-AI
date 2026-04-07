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
        sampleTestCases: [
            {
                input: String,
                output: String,
            },
        ],
        hiddenTestCases: [
            {
                input:String,
                output:String,
            },
        ],
    }
);

const Question = mongoose.model("Question",questionSchema);

export default Question;
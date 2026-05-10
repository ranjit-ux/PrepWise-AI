import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        questions:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Question",
            },
        ],

        currentQuestionIndex:{
            type:Number,
            default:0,
        },
        
        attempts:{
            type: [Number],
            default: [0,0,0],
        },

        status:{
            type:String,
            enum:["ongoing","completed"],
            default:"ongoing",
        },

        startTime:{
            type:Date,
            default:Date.now,
        },
        review: {
            type:String,
            default:"",
        },
        codeSubmission: [
            {
                questionId: {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Question"
                },
                code:String,
                result: String
            }
        ],
        speechTranscript: {
            type: String,
            default:""
        },
        report: {
            type:Object,
            default:null
        }
    },
    {timestamps:true}
);

const Interview=mongoose.model("Interview",interviewSchema);

export default Interview;
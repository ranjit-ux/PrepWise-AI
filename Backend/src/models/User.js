import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            match:[/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },
        password:{
            type:String,
            required:true,
            minlength:6,
            validate:{
                validator: function(v){
                    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(v);
                },
                message:"Password must contain at least one letter and one number"
            }
        },
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;
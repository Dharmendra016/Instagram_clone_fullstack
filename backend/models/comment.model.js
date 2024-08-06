import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text:{
        type:String, 
        required:true,   
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        require:true,
    }

})

export const comment = mongoose.model("comment" , commentSchema);
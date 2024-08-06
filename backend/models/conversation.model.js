import mongoose, { mongo } from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"message",
    }]
})

export const conversation = mongoose.model("conversation" , conversationSchema);
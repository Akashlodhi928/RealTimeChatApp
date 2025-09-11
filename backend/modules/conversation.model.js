import mongoose from "mongoose"
import User from "../modules/user.model.js";

const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"message"
        }
    ]
   
}, {timestamps:true})

const Conversation = mongoose.model("conversation", conversationSchema)
export default Conversation



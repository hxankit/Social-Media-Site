import mongoose from "mongoose";
import User from "./user.model.js";
import Post from "./post.model.js";
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    auther: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Post,
        required: true
    },
})
export default  mongoose.model('Comment',commentSchema);
import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    image:{
        type:String,
        required:true
    },
    auther:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        
    }],
},{
    timestamps:true
})
export default mongoose.model('Post',postSchema);    
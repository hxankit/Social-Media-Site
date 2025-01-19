import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
       
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
       
    },
    message: {
        type: String,
        required: true
    },
    
});

export default Message = mongoose.model('Message', messageSchema);


import Conversation from "../models/conversation.model.js"

const sendMessage = async (req, res) => {
    try {
        const senderId = req.id
        const receiverId = req.params.id
        const { message } = req.body

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = {
            senderId,
            receiverId,
            message
        }
        if (newMessage) Conversation.message.push(newMessage._id)

        await Promise.all([newMessage.save(), conversation.save()])


        return res.status(200).json({
            message: "Message sent successfully",
            newMessage
        })
    } catch (error) {
        console.log(error)
    }
}
const getMessages = async (req, res) => {
    try {
        const senderId = req.id
        const receiverId = req.params.id
        const conversation = await Conversation.find({
            participants: { $all: [senderId, receiverId] }
        })
        if (!conversation) {
            return res.status(200).json({
                succes: true,
                message: "No messages found"
            })
        }
        return res.status(200).json({
            success: true,
            message: conversation?.messages
        })
    }
    catch (error) {
        console.log(error)
    }
}


export { sendMessage, getMessages }
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import supabase from "../lib/supabase.js";
import {io, getSocketIdByUserId} from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filtereredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filtereredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({message: "Internal server error"});        
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId:senderId, receiverId:receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        })
        res.status(200).json(messages);
    } catch (err) {
        console.log("Error in getMessages controller: ", err.message);
        res.status(500).json({message: "Internal server error"});          
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const senderId = req.user._id;
        const {id:receiverId} = req.params;

        let imageUrl;
        if(image) {
            const data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(data, "base64")
            const fileName = `${Date.now()}.png`

            const {error: uploadError} = await supabase.storage.from("message-media").upload(fileName, buffer, {
                contentType: "image/png",
                upsert: false
            })

            if (uploadError) throw uploadError; 
            const { data: urlData } = supabase.storage.from('message-media').getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
        }

        const message = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            image: imageUrl
        });
        await message.save();
        
        // Real-time message delivery
        const receiverSocketId = getSocketIdByUserId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }
        
        res.status(201).json(message);

    } catch (err) {
        console.log("Error in sendMessage controller: ", err.message);
        res.status(500).json({message: "Internal server error"});         
    }
}
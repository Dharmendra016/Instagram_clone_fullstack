import { conversation } from "../models/conversation.model.js";
import {message} from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {

    try {
        
        const senderId = req.id; 
        const receiverId = req.params.id;

        const {Message} = req.body ;

        let Conversation = await conversation.findOne({
            participants:{$all:[senderId , receiverId]}
        })

        //establish the conversation if not started yet
        if( !Conversation ){
            Conversation = await conversation.create({
                participants:[senderId,receiverId]
            })
        };

        const newMessage = await message.create({
            senderId,
            receiverId, 
            message:Message
        })

        if(newMessage) Conversation.messages.push(newMessage._id);

        // await Conversation.save();
        // await newMessage.save();

        //or you can do this two steps in one by using promise; 
        await Promise.all([Conversation.save() , newMessage.save()]);

        //implement socket.io for real time data transfter 

        const receiverSocketId = getReceiverSocketId(receiverId);

        if( receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }

        return res.status(200).json({
            success:true, 
            newMessage,
        })

    } catch (error) {
        console.log(error);
    }

}


export const getMessage = async (req, res) => {

    try {

        const senderId = req.id; 
        const receiverId = req.params.id; 


        const Conversation = await conversation.find({
            participants:{$all:[senderId,receiverId]}
        })

        if(!conversation) return res.status(200).json({success:false,message:[]})

        return res.status(200).json({
            success:true,
            messages:Conversation?.messages
        })
        
    } catch (error) {
        console.log(error);
    }

}
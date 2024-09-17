import { conversation } from "../models/conversation.model";
import {message} from "../models/message.model"

export const sendMessage = async (req, res) => {

    try {
        
        const senderId = req.id; 
        const receiverId = req.params.id;

        const {message} = req.body ;

        let Conversation = await conversation.findOne({
            participants:{$all:[senderId , receiverId]}
        })

        //establish the conversation if not started yet
        if( !conversation ){
            conversation = await conversation.create({
                participants:[senderId,receiverId]
            })
        };

        const newMessage = await message.create({
            senderId,
            receiverId, 
            message
        })

        if(newMessage) conversation.messages.push(newMessage._id);

        // await Conversation.save();
        // await newMessage.save();

        //or you can do this two steps in one by using promise; 
        await Promise.all([Conversation.save() , newMessage.save()]);

        //implement socket.io for real time data transfter 

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
import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { toast } from 'sonner';

const ChatPage = () => {
    const { user, suggestedUser, selectedUser } = useSelector(store => store.auth);
    const {onlineUsers} = useSelector(store => store.chat);
    const dispatch = useDispatch();
    const [selected, setSelected] = useState(false);

    const [textMessage, setTextMessage] = useState("");
    const {messages} = useSelector(store => store.chat);
    const chatUserHandler = async (selectedUser) => {
        try {
            dispatch(setSelectedUser(selectedUser));
            setSelected(true);

        } catch (error) {
            console.log(error);
        }
    }

    const sendMessageHandler = async (receiverId) => {
        try {
            
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`,{Message:textMessage},{
                headers:{
                    "Content-Type":"application/json",
                },
                withCredentials:true,
            })

            if( res.data.success){
                console.log(res.data);
                dispatch(setMessages([...messages , res.data.newMessage]))

            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        return () =>{
            dispatch(setSelectedUser(null));
        }
    },[])


    return (
        <div className='flex ml-[16%]  h-screen'>
            <section className='border-r'>
                <h1 className='font-bold mb-4 px-3 text-xl '>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />

                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUser.map((suggestedUsr) => {
                            const isOnline = onlineUsers.includes(suggestedUsr?._id);
                            console.log('isonlien',isOnline);
                            return (
                                <div key={suggestedUsr._id} onClick={() => { chatUserHandler(suggestedUsr) }} className='hover:bg-gray-50 cursor-pointer flex gap-3 items-center mb-3 ml-2'>
                                    <Avatar>
                                        <AvatarImage className='h-8 w-8 rounded-full' src={suggestedUsr?.profilePic} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{suggestedUsr?.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"} `}>{isOnline ? "online" : "offline"}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selected ?

                    (
                        <section className='flex-1 flex flex-col'>
                            <div className='flex-col flex gap-2 z-10 bg-gray-50 pb-5 sticky border-b top-0'>
                                <div className='flex gap-2 mt-8 ml-5'>
                                    <Link to={`/profile/${selectedUser._id}`}>
                                        <Avatar className='h-10 w-10 rounded-full'>
                                            <AvatarImage src={selectedUser?.profilePic} className='h-10 w-10 rounded-full object-cover ' alt="post_image" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className='flex flex-col w-[800px]'>
                                        <Link to={`/profile/${selectedUser?._id}`} >
                                            <h1 className='text-sm font-semibold'>{selectedUser?.username}</h1>
                                            <h1 className='text-sm font-thin text-gray-600'>Active 5m ago</h1>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className='overflow-y-auto flex-1'>
                                <div className='flex gap-2 justify-center items-center flex-col'>
                                    <div>
                                        <h1 className='text-2xl text-bold text-center mt-8'>{selectedUser?.username}</h1>
                                        <span className='text-sm font-thin text-gray-600'>{selectedUser?.bio || "bio here..."}</span>
                                    </div>
                                    <Link to={`/profile/${selectedUser._id}`}>
                                        <Button variant="secondary" >View profile</Button>
                                    </Link>
                                </div>
                                <Messages selectedUser={selectedUser} />
                            </div>
                            <div className='flex items-center gap-3 p-4 border-t border-t-gray-200'>
                                <Input value={textMessage} onChange={(e) => {setTextMessage(e.target.value)}} type="text" className="focus-visible:ring-transparent " placeholder="write message" />
                                <Button onClick={() => {sendMessageHandler(selectedUser._id)}}>Send</Button>
                            </div>
                        </section>
                    )
                    : (
                        <div className='flex flex-col gap-3 justify-center items-center h-full w-[800px]'>
                            <div className='h-[110px] w-[110px] flex justify-center items-center rounded-full border border-black'>
                                <MessageCircle size={80} />
                            </div>
                            <h1>Your messages</h1>
                            <span>Send a message to start a chat.</span>
                            <Button className="bg-[#035afc] hover:bg-[#2c76ff]">Send message</Button>
                        </div>
                    )
            }
        </div>
    )
}

export default ChatPage
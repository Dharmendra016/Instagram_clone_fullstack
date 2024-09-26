import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { MessageCircle } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Messages from './Messages';

const ChatPage = () => {
    const { user, suggestedUser, selectedUser } = useSelector(store => store.auth);

    const dispatch = useDispatch();
    const isOnline = true;

    const [selected, setSelected] = useState(false);
    const chatUserHandler = async (selectedUser) => {
        try {
            dispatch(setSelectedUser(selectedUser));
            setSelected(true);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='flex ml-[16%]  h-screen'>
            <section className='border-r'>
                <h1 className='font-bold mb-4 px-3 text-xl '>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />

                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUser.map((suggestedUsr) => {
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
                                <Input type="text" className="focus-visible:ring-transparent " placeholder="write message" />
                                <Button>Send</Button>
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
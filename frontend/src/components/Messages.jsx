import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetRTM from '@/hooks/useGetRTM';
import React from 'react'
import { useSelector } from 'react-redux'

const Messages = () => {
    useGetAllMessages();
    useGetRTM();
    const {user} = useSelector(store => store.auth)
    const {messages} = useSelector(store => store.chat);
    return (
        <div className='flex-1 p-4'>
            <div className='flex flex-col gap-3'>
               {
                messages?.map((msg)=>{
                    console.log(msg);
                    return <div className={`flex ${msg.senderId === user?._id ? 'justify-end':'justify-start'}  `}>
                        <div className={`p-2 rounded-lg max-w-xs
                        break-words ${msg.senderId === user?._id ? "bg-blue-400":'bg-gray-300' } `}>
                            {msg.message}
                        </div>
                    </div>
                })
                }
            </div>
        </div>
    )
}

export default Messages
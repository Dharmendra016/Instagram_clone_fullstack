import React from 'react'
import { useSelector } from 'react-redux'

const Messages = ({ selectedUser }) => {
    const {messages} = useSelector(store => store.chat);
    return (
        <div className='flex-1 p-4'>
            <div className='flex flex-col gap-3'>
               {
                messages?.map((msg)=>{
                    return <div className={`flex`}>
                        <div>
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
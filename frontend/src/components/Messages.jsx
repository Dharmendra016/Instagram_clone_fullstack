import React from 'react'
import { useSelector } from 'react-redux'

const Messages = ({ selectedUser }) => {
    const {messages} = useSelector(store => store.chat);
    return (
        <div className='flex-1 p-4'>
            <div className='flex flex-col gap-3'>
               {
                [1,2,3,4].map((message)=>{
                    return <div className={`flex`}>
                        <div>
                            {messages}
                        </div>
                    </div>
                })
                }
            </div>
        </div>
    )
}

export default Messages
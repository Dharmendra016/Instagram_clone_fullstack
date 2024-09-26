import React from 'react'

const Messages = ({ selectedUser }) => {
    return (
        <div className='flex-1 p-4'>
            <div className='flex flex-col gap-3'>
               {
                [1,2,3,4].map((message)=>{
                    return <div className={`flex`}>
                        <div>
                            message
                        </div>
                    </div>
                })
                }
            </div>
        </div>
    )
}

export default Messages
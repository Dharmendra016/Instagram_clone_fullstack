import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

const ChatWithUser = () => {
    const { selectedUser } = useSelector(store => store.auth);

    return (
        <div>
            <div className='w-[800px] flex flex-col gap-2 z-10 bg-gray-50 sticky top-0'>
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
                <hr className='mt-5' />
            </div>

            <div className='flex gap-2 justify-center items-center flex-col'>
                <div>
                    <h1 className='text-2xl text-bold text-center mt-8'>{selectedUser?.username}</h1>
                    <span className='text-sm font-thin text-gray-600'>{selectedUser?.bio || "bio here..."}</span>
                </div>
                <Button variant="secondary">View profile</Button>
            </div>
            <div className='h-[1000px]'>
                
            </div>
        </div>
    )
}

export default ChatWithUser
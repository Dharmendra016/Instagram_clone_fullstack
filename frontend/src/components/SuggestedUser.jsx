import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

const SuggestedUser = () => {
    const { suggestedUser } = useSelector(store => store.auth);
    return (
        <div className='my-10'>
            <div className='text-sm flex items-center justify-between'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>

            </div>
            {
                suggestedUser.map((user) => {
                    return <div key={user._id} className='flex flex-row justify-between items-center'>
                                <div className='flex gap-2 mt-8'>
                                    <Link to={`/profile/${user._id}`}>
                                        <Avatar className='h-10 w-10 rounded-full'>
                                            <AvatarImage src={user?.profilePic} className='h-10 w-10 rounded-full object-cover ' alt="post_image" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className='flex flex-col'>
                                        <Link to={`/profile/${user._id}`}>
                                            <h1 className='text-sm font-semibold'>{user?.username}</h1>
                                            <h1 className='text-sm font-thin text-gray-600'>{user?.bio || "Bio here..."}</h1>
                                        </Link>
                                    </div>
                                </div>
                                
                                <h1 className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#4fb9ff]'>Follow</h1>
                            </div>
                })
            }
        </div>
    )
}

export default SuggestedUser
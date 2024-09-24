import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Comment = ({ c }) => {
    const name = c.author.username.split(" ");
    return (
        <div className='flex flex-row mt-3 items-center gap-2'>
            <div className='flex gap-1 items-center'>
                <Avatar>
                    <AvatarImage className='h-8 w-8 object-cover rounded-full ' src={c.author.profilePic} alt='profile pic' />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm'>{name[0]}...</h1>
            </div>
            <h1 className=' text-sm'>{c.text}</h1>
        </div>
    )
}

export default Comment
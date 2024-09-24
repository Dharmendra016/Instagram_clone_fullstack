import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUser from './SuggestedUser'

const RightSideBar = () => {
  const { user } = useSelector(store => store.auth)
  return (
    <div className='fixed top-0 flex flex-col gap-2 z-10 right-0 px-4 border-gray-300 w-[25%] h-screen'>
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
            <h1 className='text-sm font-thin text-gray-600'>{user?.bio}</h1>
          </Link>
        </div>
      </div>
      <SuggestedUser/>
    </div>
  )
}

export default RightSideBar
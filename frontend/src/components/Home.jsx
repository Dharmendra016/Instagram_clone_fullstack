import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useGetAllPost from '@/hooks/useGetAllPost'
import { useSelector } from 'react-redux'
import useGetSuggestedUser from '@/hooks/useGetSuggestedUser'
import useGetUserProfile from '@/hooks/useGetUserProfile'

const Home = () => {
  useGetSuggestedUser();
  useGetAllPost();
  const {user} = useSelector(store => store.auth);
  useGetUserProfile(user?._id);
  
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <RightSideBar/>
    </div>
  )
}

export default Home
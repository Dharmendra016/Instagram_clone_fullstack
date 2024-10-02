import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useGetAllPost from '@/hooks/useGetAllPost'
import { useDispatch, useSelector } from 'react-redux'
import { clearPosts } from '@/redux/postSlice'
import useGetSuggestedUser from '@/hooks/useGetSuggestedUser'
import useGetUserProfile from '@/hooks/useGetUserProfile'
// import { clearNotification } from '@/redux/rtnSlice'

const Home = () => {
  const dispatch = useDispatch();
  dispatch(clearPosts())
  useGetSuggestedUser();
  // dispatch(clearNotification())
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
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

export const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab , setActiveTab] = useState("posts"); 
  const { userProfile , user} = useSelector(store => store.auth);


  const isLoggedInUserProfile =  user._id === userProfile._id ? true : false;
  ;

  const isFollowing = user.following.some(followedUser => followedUser._id === userProfile._id);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === "posts"? userProfile?.posts : userProfile?.bookmark;

  return (
    <div className='flex min-w-4xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20  p-8'>
        <div className='grid grid-cols-2 items-center '>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32 rounded-full'>
              <AvatarImage src={userProfile?.profilePic} className='h-full w-full object-cover rounded-full' alt='profile pic' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>

              <div className='flex gap-2 items-center'>
                <span>{userProfile?.username}</span>

                {
                  isLoggedInUserProfile ? (<div className='flex gap-2'>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">Edit Profile</Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">View archive</Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">Ad tools</Button>
                  </div>) : (
                    isFollowing ? (<>
                      <Button variant="secondary" className="h-8">Unfollow</Button>
                      <Button variant="secondary" className="h-8">Message</Button></>) :
                      (<Button className="bg-[#0095f8] hover:bg-[#30acff] h-8">Follow</Button>)
                  )
                }
              </div>
              <div>
                <div className='flex gap-4 items-center'>
                  <p>
                    <span className='font-semibold mr-2'>{userProfile?.posts.length}</span>posts
                  </p>
                  <p>
                    <span className='font-semibold mr-2'>{userProfile?.followers.length}</span>followers
                  </p>
                  <p>
                    <span className='font-semibold mr-2 '>{userProfile?.following.length}</span>following
                  </p>
                </div>
                <div className='flex flex-col'>
                  <span className='font-semibold'>{userProfile?.bio || "bio here..."}</span>
                  <Badge variant="secondary" className="w-fit"><AtSign /><span className='pl-1'>{userProfile?.username}</span></Badge>
                  <span>Learn Code || Problem Solver 🥽🥽</span>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t w-[70%] mx-auto border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold':''} `} onClick={() => {handleTabChange("posts")}}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold':''}`} onClick={() => {handleTabChange("saved")}}>SAVED</span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return <div key={post?._id} className=' relative group cursor-pointer'>
                  <img src={post.image} alt="img" className='rounded-sm my-2 w-full aspect-square object-cover'/>
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center gap-2 hover:text-gray-300 text-white space-x-4'>
                      <Heart/>{post?.likes.length}
                      <MessageCircle/>{post?.comments.length}

                    </div>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

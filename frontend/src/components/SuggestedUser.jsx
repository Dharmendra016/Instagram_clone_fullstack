import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const SuggestedUser = () => {
    const { suggestedUser } = useSelector(store => store.auth);

    const {user} = useSelector(store => store.auth);

    const dispatch = useDispatch();

    const followUnfollowHandler = async (userProfile)=> {
        try {
    
          console.log(userProfile?._id);
          const res =await axios.get(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,{withCredentials:true});
            
          console.log(res.data);
          if( res.data.success) {
    
            const alreadyFollowing = user?.following.includes(userProfile?._id);
            const updatedUser = {
              ...user , 
              following : alreadyFollowing ? user.following?.filter(id=> id !== userProfile?._id) : [...user?.following , userProfile?._id]  
            }
            dispatch(setAuthUser(updatedUser));
            const updatedUserProfile = {
              ...userProfile , 
              followers : alreadyFollowing ? userProfile.followers?.filter(id=> id !== user?._id) : [...userProfile.followers , user?._id]  
            }
            
            dispatch(setUserProfile(updatedUserProfile));
            toast.success(res.data.message);
          }
    
        } catch (error) {
          console.log(error);
        }
      }
    


    return (
        <div className='my-10'>
            <div className='text-sm flex items-center justify-between'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>

            </div>
            {
                suggestedUser.map((usr) => {
                    return <div key={usr._id} className='flex flex-row justify-between items-center'>
                                <div className='flex gap-2 mt-8'>
                                    <Link to={`/profile/${usr._id}`}>
                                        <Avatar className='h-10 w-10 rounded-full'>
                                            <AvatarImage src={usr?.profilePic} className='h-10 w-10 rounded-full object-cover ' alt="post_image" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className='flex flex-col'>
                                        <Link to={`/profile/${usr._id}`}>
                                            <h1 className='text-sm font-semibold'>{usr?.username}</h1>
                                            <h1 className='text-sm font-thin text-gray-600'>{usr?.bio || "Bio here..."}</h1>
                                        </Link>
                                    </div>
                                </div>
                                
                                <h1 onClick={() => {followUnfollowHandler(usr)}} className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#4fb9ff]'>
                                    {
                                        user?.following?.includes(usr?._id) ? "unfollow":"follow"
                                    }
                                </h1>
                            </div>
                })
            }
        </div>
    )
}

export default SuggestedUser
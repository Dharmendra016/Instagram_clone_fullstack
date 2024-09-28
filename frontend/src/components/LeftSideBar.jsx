import { setAuthUser } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSideBar = () => {
    const navigate = useNavigate();
    const {likeNotification} = useSelector(store => store.rtn);
    const {user} = useSelector(store => store.auth) ; 
    const dispatch = useDispatch();
    const logoutHandeler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout" , {withCredentials:true})
            if( res.data.success ){
                dispatch(setAuthUser(null));
                dispatch(setPosts([]))
                dispatch(setSelectedPost(null));
                navigate("/login");
                toast.success(res.data.message);
            }

        } catch (error) {
            toast.error(error.response.data.message); 
        }
    }

    const [open , setOpen] = useState(false);
    const sideItemhandler = async (type) => {
        if( type === 'Logout') {
            logoutHandeler()
        }else if(type === "Create"){
            setOpen(true);
        }else if( type === "Profile"){
            navigate(`/profile/${user._id}`)
        }else if( type === "Home"){
            navigate('/')
        }else if (type === "Messages"){
            navigate("/chat")
        };

    }

    const sidebarItems = [
        { icon: <Home />, text: "Home", },
        { icon: <Search />, text: "Search", },
        { icon: <MessageCircle />, text: "Messages", },
        { icon: <Heart />, text: "Notification", },
        { icon: <TrendingUp />, text: "Explore", },
        { icon: <PlusSquare />, text: "Create", },
        {
            icon: (
                <Avatar className='w-6 h-6 rounded-full'>
                    <AvatarImage className='rounded-full h-full w-full' src= {user?.profilePic} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        { icon: <LogOut />, text: "Logout", },
    
    ]

    return (
        <div className='fixed top-0  z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold'>LOGO</h1>

                <div>
                    {sidebarItems.map((item, index) => {
                        return <div key={index} onClick={() => {sideItemhandler(item.text)}} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                            {item.icon}
                            {item.text}

                            {
                                item.text === 'Notification' && likeNotification.length > 0 && (
                                    <Popover>
                                        <PopoverTrigger asChild> 
                                            <Button size='icon' className="rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600">{likeNotification.length}</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div>
                                                {
                                                    likeNotification?.length === 0 ? (<p>No new notification</p>):likeNotification.map((notification)=>{
                                                        return (
                                                            <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                <Avatar className='h-10 w-10 rounded-full'>
                                                                    <AvatarImage src={notification.userDetails?.profilePic} className='w-7 h-7 rounded-full'/>
                                                                    <AvatarFallback>CN</AvatarFallback>
                                                                </Avatar>
                                                                <p className='text-sm'> <span  className='font-bold mr-2'>{notification.userDetails?.username}</span>liked your post</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                        </div>
                    })
                    }
                </div>
            </div>
            <CreatePost open={open} 
            setOpen = {setOpen}/>
        </div>
    )
}

export default LeftSideBar
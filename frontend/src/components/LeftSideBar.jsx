import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

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
                <AvatarImage className='rounded-full' src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ), text: "Profile"
    },
    { icon: <LogOut />, text: "Logout", },

]

const LeftSideBar = () => {
    const navigate = useNavigate();
    const logoutHandeler = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/v1/user/logout" , {withCredentials:true})
            if( res.data.success ){
                navigate("/login");
                toast.success(res.data.message);
            }

        } catch (error) {
            toast.error(error.response.data.message); 
        }
    }

    const sideItemhandler = async (type) => {
        if( type === 'Logout') logoutHandeler() ;

    }
    return (
        <div className='fixed top-0  z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold'>LOGO</h1>

                <div>
                    {sidebarItems.map((item, index) => {
                        return <div key={index} onClick={() => {sideItemhandler(item.text)}} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                            {item.icon}
                            {item.text}
                        </div>
                    })
                    }
                </div>
               
            </div>
        </div>
    )
}

export default LeftSideBar
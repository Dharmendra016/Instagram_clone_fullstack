import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {

    const { user } = useSelector(store => store.auth);
    const imageRef = useRef();

    const [preview, setPreview] = useState(null); // To store the image preview
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePic: user?.profilePic,
        bio: user?.bio,
        gender: user?.gender
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("hero");
            setInput({ ...input, profilePic: file })

            const reader = new FileReader(); // Create a new FileReader
          
            reader.onload = (e) => {
              const dataURL = e.target.result; // This is the Data URL
              setPreview(dataURL); // Store the Data URL to use as the image source
            };
        
            reader.readAsDataURL(file); // Convert the file into a Data URL
        };


    }
    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }


    const profilePic = !preview ? user?.profilePic : preview;

    const editProfileHandler = async () => {
        try {
            const formData = new FormData();
            formData.append("bio",input.bio);
            formData.append("gender" , input.gender);
            if( input.profilePic ){
                formData.append("profilePic",input.profilePic);
            }
            console.log(input);
            setLoading(true);
            const res = await axios.post('https://instagram-clone-fullstack-ey08.onrender.com/api/v1/user/profile/edit', formData , {
                headers:{
                    'Content-Type':"multipart/form-data"
                },
                withCredentials: true,
            });

            if(res.data.success){
                const updatedUserData ={ 
                    ...user,
                    bio:res.data.user?.bio,
                    profilePic:res.data.user?.profilePic,
                    gender:res.data.user?.gender,
                };
                dispatch(setAuthUser(updatedUserData))
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl '>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 gap-2 rounded-xl p-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10 rounded-full'>
                            <AvatarImage src={profilePic} className='h-10 w-10 rounded-full object-cover ' alt="post_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>

                            <h1 className='text-sm font-semibold'>{user?.username}</h1>
                            <h1 className='text-sm font-thin text-gray-600'>{input?.bio || "Bio here..."}</h1>

                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type="file" className='hidden' />
                    <Button onClick={() => { imageRef?.current.click() }} className="bg-[#0095f6] h-8 hover:bg-[#67c2ff]">Change Photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name="bio" className="focus-visible:ring-transparent" placeholder="write you bio"></Textarea>
                </div>

                <div>
                    <h1 className='font-bold text-xl mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>

                <div className='flex justify-end'>

                    {
                        loading ? (<Button
                            className="w-fit bg-[#0095f6] hover:bg-[#55bbff]"
                        ><Loader2 className='mr-2 h-4 w-4 animate-spin' /> please wait</Button>) : (<Button
                        onClick = {editProfileHandler}
                            className="w-fit bg-[#0095f6] hover:bg-[#55bbff]"
                        >Submit</Button>)
                    }


                </div>

            </section>
        </div>
    )
}

export default EditProfile
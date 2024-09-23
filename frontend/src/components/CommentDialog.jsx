import React, { useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'

const CommentDialog = ({ open, setOpen , comment , setComment , post}) => {
    const [text , setText] = useState("");

    const changeEventHandler = (e) => {
        const inputText = e.target.value; 
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText('');
        }
    }

    const sendMessageHandler = async ()=> {
        console.log("start");
        const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`,{text},{
            headers:{
                'Content-Type':"application/json",
            },
            withCredentials:true,
        })
        console.log(res.data);
        if(res.data.success){
            const updatedComment = [...comment , res.data.comment]
            setComment(updatedComment);
            toast.success(res.data.message);
            setText("")
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}
                className="flex flex-col p-0 max-w-5xl" >
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img className='w-full h-full object-cover rounded-l-lg' src={post.image} alt="Image" />

                    </div>

                    <div className='w-1/2 flex flex-col justify-between ' >
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex items-center gap-3 justify-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={post.author.profilePic} className='h-8 w-8 object-cover rounded-full ' />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className="font-semibold text-xs">{post.author.username}</Link>
                                </div>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center text-sm text-center">
                                    <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                                        Unfollow
                                    </div>
                                    <div className='cursor-pointer w-full'>
                                        Add to favorites
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment.map(c => {
                                    return <div key={c._id} className='flex flex-col mt-2'> 
                                        <div className='flex gap-1'>
                                        <Avatar>
                                            <AvatarImage className='h-8 w-8 object-cover rounded-full ' src={c.author.profilePic} alt='profile pic'/>
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <h1>{c.author.username}</h1>
                                        </div>
                                         <h1 className='ml-10'>{c.text}</h1>
                                         <hr />
                                    </div>
                                })
                            }
                        </div>

                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-none border border-gray-300 p-2 rounded'></input>
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} varient="outline">Send</Button>
                            </div>

                        </div>

                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
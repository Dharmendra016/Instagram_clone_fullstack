import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'

const Post = () => {
    const [text, setText] = useState("");
    const [open , setOpen] = useState(false);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }
    return (
        <div className='my- w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src="" alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col justify-center items-center">
                        <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit ">Add to favorites</Button>
                        <Button variant="ghost" className="cursor-pointer w-fit ">Delete</Button>

                    </DialogContent>
                </Dialog>
            </div>

            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src="../../public/img_profile.jpg" alt="Post_image" />


            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4'>
                    <FaRegHeart size={'24px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>1k likes</span>
            <p >
                <span className='font-medium mr-2'>username</span>
                caption
            </p>
            <span onClick={() => {setOpen(true)}} className='cursor-pointer text-sm text-gray-400'>View all 10 comments</span>
            <CommentDialog open = {open }  setOpen = {setOpen} />
            <div className='flex justify-between items-center'>
                <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder='Add a comment...'
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span className='text-[#38ADF8]'>Post</span>
                }
                
            </div>
        </div>
    )
}

export default Post
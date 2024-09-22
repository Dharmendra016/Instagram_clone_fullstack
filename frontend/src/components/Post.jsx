import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);

    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    const [liked, setLiked] = useState(post.likes.includes(user._id) || false)

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const deletePostHandler = async () => {
        try {

            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, { withCredentials: true })

            if (res.data.success) {
                const updatedPosts = posts.filter((postItem) => postItem._id !== post._id);
                dispatch(setPosts(updatedPosts));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const likeOrDislikeHandler = async (postId) => {

        try {
            const action = liked ? "dislike" : "liked";

            const res = await axios.get(`http://localhost:8000/api/v1/post/${postId}/${action}`, { withCredentials: true })

            if (res.data.success) {
                setLiked(!liked);
                toast.success(res.data.message);
            }


        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className='my- w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar className='h-8 w-8 rounded-full'>
                        <AvatarImage src={post.author?.profilePic} className='w-full h-full rounded-full object-cover ' alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className='text-sm font-thin'>{post.author?.username}</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col justify-center items-center">
                        {
                            user && user?._id !== post.author._id && <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
                        }
                        <Button variant="ghost" className="cursor-pointer w-fit ">Add to favorites</Button>

                        {
                            user && user?._id === post.author._id && <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit ">Delete</Button>
                        }

                    </DialogContent>
                </Dialog>
            </div>

            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image} alt="Post_image" />


            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4'>
                    <FaRegHeart onClick={likeOrDislikeHandler} size={'24px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{post.likes.length} likes</span>
            <p >
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            <span onClick={() => { setOpen(true) }} className='cursor-pointer text-sm text-gray-400'>View all {post.comments.length} comments</span>
            <CommentDialog open={open} setOpen={setOpen} />
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
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
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import { setAuthUser, setUserProfile } from '@/redux/authSlice'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);

    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    const [liked, setLiked] = useState(post.likes.includes(user._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length);

    const [comment, setComment] = useState(post.comments)

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

            const res = await axios.delete(`https://instagram-clone-fullstack-ey08.onrender.com/api/v1/post/delete/${post._id}`, { withCredentials: true })

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

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://instagram-clone-fullstack-ey08.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const commentHandler = async () => {

        try {

            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': "application/json",
                },
                withCredentials: true,
            })
            if (res.data.success) {
                const updatedComment = [...comment, res.data.comment]
                setComment(updatedComment);
                const updatedPost = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedComment } : p
                )
                dispatch(setPosts(updatedPost));
                toast.success(res.data.message);
                setText("");

            }

        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        }

    }

    const bookmarkHandler = async () => {

        try {

            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true })

            if (res.data.success) {
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
        }
    }


    const followUnfollowHandler = async (userProfile) => {
        try {

            console.log(userProfile?._id);
            const res = await axios.get(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`, { withCredentials: true });


            if (res.data.success) {
                const alreadyFollowing = user?.following.includes(userProfile?._id);
                const updatedUser = {
                    ...user,
                    following: alreadyFollowing ? user.following?.filter(id => id !== userProfile?._id) : [...user.following, userProfile?._id]
                }
                dispatch(setAuthUser(updatedUser));
                const updatedUserProfile = {
                    ...userProfile,
                    followers: alreadyFollowing ? userProfile.followers?.filter(id => id !== user?._id) : [...userProfile.followers, user?._id]
                }

                dispatch(setUserProfile(updatedUserProfile));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
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
                    <div className='flex gap-3'>
                        <h1 className='text-sm font-thin'>{post.author?.username}</h1>
                        {
                            post.author._id === user._id && <Badge variant="secondary" className="font-semibold">Author</Badge>
                        }
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col justify-center items-center">
                        {
                            user && user?._id !== post.author._id && <Button variant='secondary' onClick={() => {followUnfollowHandler(post.author)}} className={`cursor-pointer w-fit font-bold ${user.following?.includes(post.author?._id) ? "text-[#ED4956]" : "text-[#4adbff]"}`}>
                                {
                                    user.following?.includes(post.author?._id) ? "unfollow" : "follow"
                                }
                            </Button>
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

                    {
                        liked ? (<FaHeart onClick={likeOrDislikeHandler} size={'24px'} className='cursor-pointer text-red-600' />) : (<FaRegHeart onClick={likeOrDislikeHandler} size={'24px'} className='cursor-pointer hover:text-gray-600' />)
                    }

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                    }} className='cursor-pointer hover:text-gray-600' />

                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark onClick={bookmarkHandler} className={`ursor-pointer hover:text-gray-600 `} />
            </div>
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p >
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>

            {
                post.comments.length > 0 && (<span onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true)
                }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>)
            }


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
                    text && <span className='text-[#38ADF8] cursor-pointer' onClick={commentHandler} >Post</span>
                }

            </div>
        </div>
    )
}

export default Post
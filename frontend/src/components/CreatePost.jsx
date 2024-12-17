import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'


const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file , setFile] = useState("");
  const [caption , setCaption] = useState("");

  const [preview , setPreview] = useState("");
  const [loading , setLoading] = useState(false);

  const {user} = useSelector(store => store.auth);
  const {posts} = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file_ = e.target.files?.[0];
    if(file_){
      setFile(file_);
      const dataUrl = await readFileAsDataURL(file_);
      setPreview(dataUrl)
    }
  }

  const createPostHandler = async (e) =>  {
    const formData = new FormData();
    formData.append("caption",caption);
    if(preview){
      formData.append("image", file)
    }
    try {
      setLoading(true);
      const res = await axios.post("https://instagram-clone-fullstack-ey08.onrender.com/api/v1/post/addpost" , formData , {
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true,
      })

      if(res.data.success){

        //make post updated
        console.log("res data" , res.data.posts);
        dispatch(setPosts([ res.data.posts,...posts]))
        toast.success(res.data.message);
        setOpen(false)
      }

    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      setLoading(false);
    }
  } 
 
  return (
    <Dialog open={open} >
      <DialogContent onInteractOutside={() => { setOpen(false) }}>
        <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePic} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>{user?.bio}</span>
          </div>
        </div>

        <Textarea value={caption} onChange={(e) => {setCaption(e.target.value)}} className="focus-visible:ring-transparent
        border-none" placeholder="write a caption" />

        {
          preview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img src={preview} className='w-full h-full object-contain rounded-md' alt="previewImg" />
            </div>
          )
        }

        <input onChange={fileChangeHandler} ref = {imageRef} type="file" className='hidden' />
        <Button onClick={() => imageRef?.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#45a3e2]">Select from computer</Button>
        {
          preview && (
            loading ? (<Button><Loader2 className='w-2 h-2 animate-spin '></Loader2></Button>):(<Button onClick={createPostHandler}>Post</Button>)
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
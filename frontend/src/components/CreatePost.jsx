import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file , setFile] = useState("");
  const [caption , setCaption] = useState("");

  const [preview , setPreview] = useState("");
 

  const fileChangeHandler = async (e) => {
    const file_ = e.target.files?.[0];
    if(file_){
      setFile(file_);
      const dataUrl = await readFileAsDataURL(file_);
      setPreview(dataUrl)
    }
  }
 
  return (
    <Dialog open={open} >
      <DialogContent onInteractOutside={() => { setOpen(false) }}>
        <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src="" alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>Username</h1>
            <span className='text-gray-600 text-xs'>Bio here...</span>
          </div>
        </div>

        <Textarea className="focus-visible:ring-transparent
        border-none" placeholder="write a caption" />

        {
          preview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img src={preview} className='w-full h-full object-contain' alt="previewImg" />
            </div>
          )
        }

        <input onChange={fileChangeHandler} ref = {imageRef} type="file" className='hidden' />
        <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-[#0095F6] hover:bg-[#45a3e2]">Select from computer</Button>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
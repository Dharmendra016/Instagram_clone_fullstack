import { Label } from './ui/label'
import {Input} from "./ui/input"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

const Signup = () => {

    const [input , setInput] = useState({
        username:"",
        email:"",
        password:""
    })

    const [loading , setLoading] = useState(false);
    const changeEventHandler = (e) => {
        setInput({...input , [e.target.name]:e.target.value});
    }

    const navigate = useNavigate();
    const {user} = useSelector(store => store.auth);

    const signupHandeler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            console.log(input);

            const res = await axios.post('https://instagram-clone-fullstack-ey08.onrender.com/api/v1/user/register',input , {
                headers:{
                    'Content-Type':'application/json',
                },
                withCredentials:true,
            })

            if(res.data.success){
                toast.success(res.data.message);
                setInput({
                    username:"",
                    email:"",
                    password:""
                })
            }
            navigate("/login")

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }finally{
            setLoading(false);
        }
    }

    useEffect(() =>{
        if(user){
            navigate("/");
        }
    },[])


  return (
    <div className='flex items-center w-screen h-screen justify-center'>

        <form onSubmit={signupHandeler} className='shadow-lg flex-col gap-5 p-8 flex '>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-center text-sm'>Signup to see photos and videos from your friends</p>
            </div>
            <div>
                <Label className="py-2 font-medium">Username</Label>
                <Input
                type="text"
                name='username'
                value={input.username}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent"
                />
            </div>
            <div>
                <Label className="py-2 font-medium">Email</Label>
                <Input
                type="text"
                name='email'
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent"
                />
            </div>
            <div>
                <Label className="py-2 font-medium">Password</Label>
                <Input
                type="text"
                name='password'
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent"
                />
            </div>

            {
              loading? ( <Button> <Loader2 className='w-2 h-2 animate-spin '></Loader2></Button>):(<Button className="my-3" type="submit"> Signup </Button>)
            }
            <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-400'>Login</Link></span>
        </form>

    </div>
  )
}

export default Signup
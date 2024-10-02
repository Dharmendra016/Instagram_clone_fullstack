import { Label } from './ui/label'
import {Input} from "./ui/input"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'


const Login = () => {

    const [input , setInput] = useState({
        email:"",
        password:""
    })

    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.auth);

    useEffect(() =>{
        if(user){
            navigate("/");
        }
    },[])

    const changeEventHandler = (e) => {
        setInput({...input , [e.target.name]:e.target.value});
    }

    const loginHandeler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            console.log(input);

            const res = await axios.post('http://localhost:8000/api/v1/user/login',input , {
                headers:{
                    'Content-Type':'application/json',
                },
                withCredentials:true,
            })

            if(res.data.success){
                // console.log("name",res.data.UserData);
                dispatch(setAuthUser(res.data.UserData));
                navigate('/'); 

                toast.success(res.data.message);
                setInput({
                    email:"",
                    password:""
                })
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }finally{
            setLoading(false);
        }
    }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>

        <form onSubmit={loginHandeler} className='shadow-lg flex-col gap-5 p-8 flex '>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-center text-sm'>Login to see photos and videos from your friends</p>
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
              loading? ( <Button> <Loader2 className='w-2 h-2 animate-spin '></Loader2></Button>):(<Button className="my-3" type="submit"> Login </Button>)
            }
            
            <span className='text-center'>Create an account? <Link to="/signup" className='text-blue-400'>Singup</Link></span>
        </form>

    </div>
  )
}

export default Login
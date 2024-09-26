import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
       const fetchUserProfile = async() => {
        try {            
            const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true});
            if( res.data.success){
                dispatch(setUserProfile(res.data.User))
            }

        } catch (error) {
            toast.error(error.response.data.message)
        }
       } 
       fetchUserProfile();
    },[userId])
}

export default useGetUserProfile; 
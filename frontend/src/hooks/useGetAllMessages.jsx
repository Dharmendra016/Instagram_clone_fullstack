import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store => store.auth);
    useEffect(() => {
       const fetchMessages = async() => {
        try {            
            const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});
            if( res.data.success){
                console.log("messages", res.data);
                dispatch(setMessages(res.data.messages))
            }

        } catch (error) {
            toast.error(error.response.data.message)
        }
       } 
       fetchMessages();
    },[selectedUser])
}

export default useGetAllMessages; 
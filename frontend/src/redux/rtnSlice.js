import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    likeNotification:[],
};

const rtnSlice = createSlice({
    name:'realTimeNotification',
    initialState,
    reducers:{
        setLikeNotification:(state,action)=>{
            if(!state.likeNotification){
                state.likeNotification = [];
            }
            if(action.payload.type === 'like' ){
                state.likeNotification.push(action.payload);
            }else{
                state.likeNotification = state.likeNotification.filter((item)=> 
                    item.userId !== action.payload.userId || item.postId !== action.payload.postId );
            }
        },
        clearNotification: (state)=>{
           return initialState
        }


    }
})

export const {setLikeNotification , clearNotification} = rtnSlice.actions; 
export default rtnSlice.reducer; 
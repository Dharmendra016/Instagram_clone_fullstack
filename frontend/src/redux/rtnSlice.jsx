import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification:[],
        commentNotification:[],
    },
    reducers:{
        setLikeNotification:(state,action)=>{
            if(action.payload.type === 'like' ){
                state.likeNotification.push(action.payload);
            }else{
                state.likeNotification = state.likeNotification.filter((item)=> item.userId !== action.payload.userId );
            }
        },
        setCommentNotification:(state,action) => {
            if(action.payload.type === 'comment' ){
                state.commentNotification.push(action.payload);
            }
        }

    }
})

export const {setLikeNotification ,setCommentNotification } = rtnSlice.actions; 
export default rtnSlice.reducer; 
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    posts: [],
    selectedPost:null,
  };

  
const postSlice = createSlice({
    name:"post",
    initialState,
    reducers:{
        setPosts:(state , action) => {
            state.posts =  action.payload
        },
        clearPosts:(state) => {
            return initialState;
        },
        setSelectedPost:(state , action) =>{
            state.selectedPost = action.payload
        }
    }
})
export const {setPosts , clearPosts , setSelectedPost} = postSlice.actions;
export default postSlice.reducer; 

import { createSlice } from"@reduxjs/toolkit";

const postSlice= createSlice({
    name:'post',
    initialState:{
        posts:[],
        selectedPost:null,
    },
    reducers:{
        setPosts:(state,action)=>{
            state.posts=action.payload
        },
        setselectedPost:(state,action)=>{
            state.selectedPost=action.payload
        }
        
    }
})
export const {setPosts,setselectedPost}=postSlice.actions
export default postSlice.reducer
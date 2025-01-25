import SuggesstedUsers from '@/components/SuggesstedUsers';
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Default value for user
    SuggestedUsers:[],
    userProfile:null
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggesstedUsers:(state,action)=>{
state.SuggestedUsers=action.payload
    },
    setuserProfile:(state,action)=>{
state.userProfile=action.payload
    }
  },
});

export const { setAuthUser ,setSuggesstedUsers,setuserProfile} = authSlice.actions;
export default authSlice.reducer;

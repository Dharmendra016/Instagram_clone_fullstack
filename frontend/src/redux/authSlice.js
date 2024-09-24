import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  suggestedUser:[],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUser:(state, action) => {
      state.suggestedUser = action.payload;
    }
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;

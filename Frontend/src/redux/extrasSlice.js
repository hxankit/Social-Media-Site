// src/redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showMainLayoutExtras: true
};

const uiSlice = createSlice({
  name: 'extras',
  initialState,
  reducers: {
    showMainLayoutExtras: (state) => {
      state.showMainLayoutExtras = true;
    },
    hideMainLayoutExtras: (state) => {
      state.showMainLayoutExtras = false;
    },
  },
});

export const { showMainLayoutExtras, hideMainLayoutExtras } = uiSlice.actions;
export default uiSlice.reducer;

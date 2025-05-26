// File: src/store.js
// Purpose: Defines the Redux store for the application.

import { configureStore, createSlice } from '@reduxjs/toolkit';

// A simple placeholder slice. In a real app, you'd have reducers for different parts of your state.
const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState: {
    message: 'Redux store is active!',
  },
  reducers: {
    // You can add reducer functions here if needed later
  },
});

const store = configureStore({
  reducer: {
    placeholder: placeholderSlice.reducer,
    // Add other reducers here as your application grows
  },
});

export default store; 
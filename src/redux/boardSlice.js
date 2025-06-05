import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('board/fetchPosts', async (page) => {
  const limit = 10;
  const response = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
  return response.data;
});

const boardSlice = createSlice({
  name: 'board',
  initialState: {
    posts: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = [...state.posts, ...action.payload];
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default boardSlice.reducer;

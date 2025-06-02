import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    selectedPost: null,
};

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers:{
        setPosts(state, action) {
            state.posts = action.payload;
        },
        selectPost(state, action) {
            state.selectedPost = action.payload;
        }
    }
});

//payload는 그 함수가 언제, 어떤 데이터로 호출되느냐에 따라 달라짐 --> dispatch 호출시에 결정

export const {setPosts, selectPost} = boardSlice.actions;
export default boardSlice.reducer;

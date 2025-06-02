import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    userInfo: null,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.userInfo = action.payload; // 이게 뭐지?? dispatch하면 받는 객체 형식의 데이터
        },
        logout(state) {
            state.isLoggedIn = false;
            state.userInfo = null;
        },
    },
});

// 여기에서 action은 복수고 reducer는 단수인 게 헷갈림.
export const {login, logout} = userSlice.actions;
export default userSlice.reducer;

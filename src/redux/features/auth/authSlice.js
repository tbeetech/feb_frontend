import { createSlice } from "@reduxjs/toolkit";

const loadUserFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem("user");
        if (serializedState === null) return { user: null, isAuthenticated: false };
        return { user: JSON.parse(serializedState), isAuthenticated: true };
    } catch (error) {
        return { user: null, isAuthenticated: false };
    }
};

const initialState = loadUserFromLocalStorage();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = !!action.payload.user;
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
        },
        updateUserProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload.user };
            state.isAuthenticated = !!state.user;
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    }
});

export const { setUser, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;